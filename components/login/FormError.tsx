import { X } from 'lucide-react';

interface Props {
  actionState: { message?: string; issues?: string[] };
}

const FormError = ({ actionState }: Props) => {
  if (!actionState) return null;

  return (
    <>
      {actionState.message && !actionState.issues && <div className={'text-red-500'}>{actionState.message}</div>}
      {actionState.issues && (
        <div className={'text-red-500'}>
          <ul>
            {actionState.issues.map((issue) => (
              <li key={issue} className='flex gap-1'>
                <X fill='red' />
                {issue}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default FormError;
