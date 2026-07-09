import type { LocalDestinationFormValues } from '../types';
import DestinationFormRoot from './root-field';

export interface DestinationFormLocalProps {
    defaultValues: LocalDestinationFormValues;
    errors: Record<string, string>;
}

const DestinationFormLocal: React.FC<DestinationFormLocalProps> = ({
    defaultValues,
    errors,
}) => {
    return (
        <>
            <DestinationFormRoot
                defaultValues={defaultValues}
                errors={errors}
            />
        </>
    );
};

export default DestinationFormLocal;
