import { Howl } from 'howler';

export type SoundName = 'intro' | 'siren' | 'chomp' | 'power_siren' | 'eat_ghost' | 'death';

export class AudioManager {
    private sounds: Map<SoundName, Howl> = new Map();
    private activeLoops: Map<SoundName, number> = new Map();

    constructor() {
        const soundFiles: Record<SoundName, string> = {
            intro: 'sounds/intro.mp3',
            siren: 'sounds/siren.wav',
            chomp: 'sounds/chomp.wav',
            power_siren: 'sounds/power_siren.mp3',
            eat_ghost: 'sounds/eat_ghost.mp3',
            death: 'sounds/death.mp3',
        };

        for (const [name, path] of Object.entries(soundFiles)) {
            this.sounds.set(name as SoundName, new Howl({
                src: [path],
                preload: true,
            }));
        }
    }

    public play(name: SoundName, loop: boolean = false, onEnd?: () => void): number | undefined {
        const sound = this.sounds.get(name);
        if (!sound) return undefined;

        sound.loop(loop);
        if (onEnd) {
            sound.once('end', onEnd);
        }
        const id = sound.play();
        
        if (loop) {
            this.activeLoops.set(name, id);
        }
        
        return id;
    }

    public stop(name: SoundName) {
        const sound = this.sounds.get(name);
        if (sound) {
            sound.stop();
            this.activeLoops.delete(name);
        }
    }

    public isPlaying(name: SoundName): boolean {
        return this.activeLoops.has(name);
    }

    public setVolume(name: SoundName, volume: number) {
        const sound = this.sounds.get(name);
        if (sound) {
            sound.volume(volume);
        }
    }
}
