import { useCallback, useRef, useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

import { cronPresets } from '../../constants';

interface CronExpressionFieldProps {
    defaultValue?: string;
    errors?: Record<string, string>;
}

const CronExpressionField = ({
    defaultValue,
    errors,
}: CronExpressionFieldProps) => {
    const cronExpressionRef = useRef<HTMLInputElement>(null);

    const [cronExpression, setCronExpression] = useState<string>(
        defaultValue || '',
    );
    const [selectedPreset, setSelectedPreset] = useState<string | null>(() => {
        const found = Object.entries(cronPresets).find(
            ([, preset]) => preset.value === defaultValue,
        );

        return found ? found[0] : null;
    });

    const handleInputChange = useCallback((value: string) => {
        setCronExpression(value);

        const found = Object.entries(cronPresets).find(
            ([, preset]) => preset.value === value,
        );

        if (found) {
            setSelectedPreset(found[0]);
        } else {
            setSelectedPreset(null);
        }
    }, []);

    const handlePresetClick = useCallback(
        (value: string) => {
            if (cronExpressionRef.current) {
                handleInputChange(value);
            }
        },
        [handleInputChange],
    );

    return (
        <>
            <Label className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">
                Cron Expression
            </Label>
            <Input
                ref={cronExpressionRef}
                placeholder="0 0 * * *"
                className="my-3 h-10 font-mono"
                value={cronExpression}
                name="cron_expression"
                id="cron_expression"
                onChange={(e) => handleInputChange(e.target.value)}
            />
            <div className="my-3 flex flex-wrap gap-2 text-sm">
                {Object.entries(cronPresets).map(([key, { label, value }]) => (
                    <Button
                        key={key}
                        type="button"
                        size="sm"
                        variant="ghost"
                        className={cn(
                            'cursor-pointer bg-neutral-200/50 dark:bg-slate-700',
                            {
                                'bg-neutral-400 font-semibold dark:bg-slate-600':
                                    selectedPreset === key,
                            },
                        )}
                        onClick={() => handlePresetClick(value)}
                    >
                        {label}
                    </Button>
                ))}
            </div>

            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Use standard cron syntax or choose a common schedule above.
            </p>

            <InputError message={errors?.cronExpression} />
        </>
    );
};

export default CronExpressionField;
