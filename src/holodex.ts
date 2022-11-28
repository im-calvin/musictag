import {HolodexApiClient, Video} from 'holodex.js';
import {parse} from 'dotenv';
import {readFile} from 'node:fs/promises';

class EnvProvider {
  static #parsedEnv: Partial<Record<string, string>> | null = null;

  private constructor() {}

  static async readEnv(env: string): Promise<string> {
    if (!this.#parsedEnv) {
      this.#parsedEnv = parse(await readFile('.env'));
    }

    const realEnv = process.env[env];
    if (realEnv !== undefined) {
      return realEnv;
    }

    const envValue = this.#parsedEnv[env];
    if (envValue !== undefined) {
      return envValue;
    }

    throw new Error('エラーです。');
  }
}

export class HolodexClientProvider {
  static #client: HolodexApiClient | null = null;

  private constructor() {}

  static async getVideoData(videoID: string): Promise<Video> {
    if (!this.#client) {
      this.#client = new HolodexApiClient({
        apiKey: await EnvProvider.readEnv('HOLODEX_API_KEY'),
      });
    }

    const {songs} = await this.#client.getVideo(videoID);
    for (const song of songs) {
      console.log(song.artUrl);
      console.log(song.artist);
      console.log(song.name);
    }

    return this.#client.getVideo(videoID);
  }
}
