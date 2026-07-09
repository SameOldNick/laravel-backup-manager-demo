import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { RootFormValues } from '../types';

export interface DestinationFormRootProps {
    defaultValues: RootFormValues;
    errors: Record<string, string>;
    optional?: boolean;
}

const DestinationFormRoot: React.FC<DestinationFormRootProps> = ({
    defaultValues,
    errors,
    optional,
}) => {
    return (
        <>
            <div className="col-span-12">
                <Label className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">
                    Root Path{' '}
                    {optional ? (
                        <span className="text-muted-foreground">
                            (optional)
                        </span>
                    ) : (
                        <span className="text-red-600">*</span>
                    )}
                </Label>
                <div>
                    <Input
                        name="root"
                        type="text"
                        placeholder="backups/local"
                        className="my-3 h-10"
                        defaultValue={defaultValues?.root ?? ''}
                    />
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Use a relative path only. Example:
                    <span className="font-mono">backups/local</span>
                </p>
                <InputError message={errors.root} />
            </div>
        </>
    );
};

export default DestinationFormRoot;
