import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { DestinationFormValues } from '../types';

interface DestinationFormConnectionProps {
    defaultValues: DestinationFormValues;
    errors: Record<string, string>;
}

const DestinationFormConnection: React.FC<DestinationFormConnectionProps> = ({
    defaultValues,
    errors,
}) => {
    return (
        <>
            <div className="col-span-12 sm:col-span-8">
                <Label className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">
                    Host <span className="text-red-600">*</span>
                </Label>
                <div>
                    <Input
                        name="host"
                        type="text"
                        placeholder="Enter host"
                        className="my-3 h-10"
                        defaultValue={defaultValues.host}
                    />
                </div>
                <InputError message={errors.host} />
            </div>

            <div className="col-span-12 sm:col-span-4">
                <Label className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">
                    Port <span className="text-red-600">*</span>
                </Label>
                <div>
                    <Input
                        name="port"
                        type="number"
                        min={1}
                        max={65535}
                        placeholder="Enter port"
                        className="my-3 h-10"
                        defaultValue={defaultValues.port}
                    />
                </div>
                <InputError message={errors.port} />
            </div>
        </>
    );
};

export default DestinationFormConnection;
