"use strict";
import {Singing} from "./audio/live";

export class LocalPlayer {
    constructor(song, part, audio) {
        this.song = song;
        this.part = part;
        this.singing = null;
        this.audio = audio;
    }

    setSong(song) {
        this.song = song;
    }

    prepare() {
        this.singing = new Singing(this.song, this.audio);
    }

    start() {
        this.singing.start();
    }

    stop() {
        this.singing.stop();
    }

    notesInRange(start, end) {
        return this.singing.notesInRange(start, end);
    }

    get score() {
        let part = this.song.parts[this.part];
        let expected = part.map((x) => x.notes).reduce((a, c) => a.concat(c), []);
        // console.log(expected);
        let actual = this.singing.notes;
        let i = 0;
        let totalBeats = expected.filter((x) => x.type !== 'F').reduce((a, v) => a + v.length, 0);
        let scorePerBeat = 10000 / totalBeats;
        let score = 0;
        for(let note of expected) {
            if (note.type === 'F') {
                continue;
            }
            while (actual[i] && actual[i].time < note.beat) ++i;
            while (actual[i] && actual[i].time < note.beat + note.length) {
                if (!actual[i]) {
                    break;
                }
                let diff = Math.abs((actual[i].note % 12) - (note.pitch % 12));
                if (diff <= 1 || diff >= 11) {
                    score += scorePerBeat;
                }
                ++i;
            }
        }
        // console.log(i);
        return Math.round(score);
    }
}

export class RemotePlayer {
    constructor(song, part, audio) {
        console.log(song, part, audio);
        this.song = song;
        this.part = part;
        this.audio = audio;
        this.score = 0;
        this.notes = [];
    }

    setSong(song) {
        this.song = song;
    }

    prepare() {

    }

    start() {

    }

    stop() {

    }

    addNotes(notes) {
        this.notes.push(...notes);
    }

    notesInRange(start, end) {
        return this.notes.filter((x) => start <= x.time && x.time < end);
    }
}