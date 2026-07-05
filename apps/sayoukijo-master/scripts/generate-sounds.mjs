import { mkdir, writeFile } from "node:fs/promises";

const sampleRate = 44100;
const packs = {
    chime: {
        click: [[660, 0.07]],
        reveal: [[520, 0.08], [660, 0.1]],
        correct: [[660, 0.1], [880, 0.16]],
        wrong: [[310, 0.12], [240, 0.14]],
        purchase: [[560, 0.08], [740, 0.09], [980, 0.16]],
        "level-up": [[520, 0.1], [660, 0.1], [880, 0.11], [1040, 0.2]]
    },
    arcade: {
        click: [[300, 0.06]],
        reveal: [[360, 0.06], [480, 0.08]],
        correct: [[520, 0.08], [780, 0.13]],
        wrong: [[260, 0.1], [170, 0.15]],
        purchase: [[420, 0.06], [620, 0.07], [840, 0.14]],
        "level-up": [[390, 0.07], [520, 0.07], [700, 0.08], [960, 0.18]]
    },
    pop: {
        click: [[720, 0.05]],
        reveal: [[640, 0.06], [820, 0.08]],
        correct: [[780, 0.07], [980, 0.12]],
        wrong: [[420, 0.08], [350, 0.12]],
        purchase: [[700, 0.05], [880, 0.06], [1120, 0.12]],
        "level-up": [[680, 0.06], [820, 0.06], [980, 0.07], [1240, 0.16]]
    },
    synth: {
        click: [[220, 0.07]],
        reveal: [[260, 0.08], [390, 0.1]],
        correct: [[440, 0.09], [660, 0.15]],
        wrong: [[190, 0.12], [140, 0.16]],
        purchase: [[330, 0.07], [520, 0.08], [780, 0.16]],
        "level-up": [[260, 0.08], [390, 0.08], [590, 0.1], [880, 0.2]]
    },
    bell: {
        click: [[780, 0.08]],
        reveal: [[660, 0.08], [880, 0.12]],
        correct: [[780, 0.1], [1040, 0.18]],
        wrong: [[370, 0.12], [290, 0.14]],
        purchase: [[660, 0.08], [880, 0.1], [1180, 0.16]],
        "level-up": [[660, 0.08], [820, 0.08], [1040, 0.1], [1320, 0.2]]
    },
    cute: {
        click: [[920, 0.05]],
        reveal: [[820, 0.06], [1080, 0.08]],
        correct: [[980, 0.07], [1320, 0.12]],
        wrong: [[520, 0.08], [420, 0.12]],
        purchase: [[880, 0.05], [1120, 0.06], [1480, 0.12]],
        "level-up": [[840, 0.06], [1040, 0.06], [1240, 0.07], [1560, 0.16]]
    },
    retro: {
        click: [[240, 0.06]],
        reveal: [[300, 0.06], [400, 0.08]],
        correct: [[460, 0.08], [690, 0.13]],
        wrong: [[210, 0.1], [140, 0.15]],
        purchase: [[360, 0.06], [540, 0.07], [760, 0.14]],
        "level-up": [[320, 0.07], [430, 0.07], [590, 0.08], [840, 0.18]]
    },
    space: {
        click: [[180, 0.08]],
        reveal: [[220, 0.09], [330, 0.12]],
        correct: [[360, 0.1], [620, 0.16]],
        wrong: [[150, 0.13], [110, 0.17]],
        purchase: [[280, 0.08], [440, 0.1], [720, 0.18]],
        "level-up": [[210, 0.09], [340, 0.09], [540, 0.11], [920, 0.22]]
    },
    wood: {
        click: [[520, 0.07]],
        reveal: [[440, 0.08], [580, 0.1]],
        correct: [[560, 0.1], [740, 0.15]],
        wrong: [[300, 0.12], [230, 0.14]],
        purchase: [[480, 0.08], [620, 0.09], [820, 0.16]],
        "level-up": [[440, 0.08], [560, 0.09], [720, 0.1], [920, 0.19]]
    }
};

function waveSample(pack, frequency, position, duration) {
    const envelope = Math.sin(Math.PI * Math.min(1, position / duration)) ** 1.5;
    const angle = 2 * Math.PI * frequency * position;
    return ["arcade", "synth", "retro", "space"].includes(pack) ? Math.sign(Math.sin(angle)) * envelope * 0.2 : Math.sin(angle) * envelope * 0.28;
}

function createWav(pack, notes) {
    const gap = 0.025;
    const totalDuration = notes.reduce((sum, [, duration]) => sum + duration + gap, 0);
    const sampleCount = Math.ceil(totalDuration * sampleRate);
    const dataSize = sampleCount * 2;
    const buffer = Buffer.alloc(44 + dataSize);
    buffer.write("RIFF", 0);
    buffer.writeUInt32LE(36 + dataSize, 4);
    buffer.write("WAVE", 8);
    buffer.write("fmt ", 12);
    buffer.writeUInt32LE(16, 16);
    buffer.writeUInt16LE(1, 20);
    buffer.writeUInt16LE(1, 22);
    buffer.writeUInt32LE(sampleRate, 24);
    buffer.writeUInt32LE(sampleRate * 2, 28);
    buffer.writeUInt16LE(2, 32);
    buffer.writeUInt16LE(16, 34);
    buffer.write("data", 36);
    buffer.writeUInt32LE(dataSize, 40);

    let noteIndex = 0;
    let noteStart = 0;
    for (let index = 0; index < sampleCount; index += 1) {
        const time = index / sampleRate;
        while (noteIndex < notes.length && time > noteStart + notes[noteIndex][1] + gap) {
            noteStart += notes[noteIndex][1] + gap;
            noteIndex += 1;
        }
        let value = 0;
        if (noteIndex < notes.length) {
            const [frequency, duration] = notes[noteIndex];
            const position = time - noteStart;
            if (position >= 0 && position <= duration) value = waveSample(pack, frequency, position, duration);
        }
        buffer.writeInt16LE(Math.round(Math.max(-1, Math.min(1, value)) * 32767), 44 + index * 2);
    }
    return buffer;
}

for (const [pack, events] of Object.entries(packs)) {
    const directory = new URL(`../assets/audio/${pack}/`, import.meta.url);
    await mkdir(directory, { recursive: true });
    for (const [eventName, notes] of Object.entries(events)) {
        await writeFile(new URL(`${eventName}.wav`, directory), createWav(pack, notes));
    }
}

console.log(`Generated ${Object.keys(packs).length} WAV sound packs.`);
