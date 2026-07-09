import { Terminal } from '@xterm/xterm';
import type {
    ITerminalAddon,
    ITerminalInitOnlyOptions,
    ITerminalOptions,
} from '@xterm/xterm';
import { useCallback, useRef } from 'react';

export interface UseXtermOptions {
    containerRef: React.RefObject<HTMLElement | null>;
}

const useXterm = ({ containerRef }: UseXtermOptions) => {
    const terminalRef = useRef<Terminal | null>(null);

    const initializeTerminal = useCallback(
        (
            options?: Partial<ITerminalOptions> & ITerminalInitOnlyOptions,
            addons: ITerminalAddon[] = [],
        ) => {
            if (!containerRef?.current) {
                console.warn(
                    'Container ref is not provided or current is null.',
                );

                return;
            }

            const terminal = new Terminal(options);

            addons.forEach((addon) => {
                terminal.loadAddon(addon);
            });

            terminal.open(containerRef.current);
            terminalRef.current = terminal;
        },
        [containerRef],
    );

    const disposeTerminal = useCallback(() => {
        if (terminalRef.current) {
            terminalRef.current.dispose();
            terminalRef.current = null;
        }
    }, []);

    return {
        getTerminal: () => terminalRef.current,
        initializeTerminal,
        disposeTerminal,
    };
};

export default useXterm;
