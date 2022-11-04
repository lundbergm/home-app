export class Mutex {
    private queue: Array<() => void> = [];
    private locked = false;

    public lock(): Promise<void> {
        return new Promise<void>((resolve) => {
            if (this.locked) {
                this.queue.push(resolve);
            } else {
                this.locked = true;
                resolve();
            }
        });
    }

    public unlock(): void {
        const next = this.queue.shift();
        if (next) {
            next();
        } else {
            this.locked = false;
        }
    }
}
