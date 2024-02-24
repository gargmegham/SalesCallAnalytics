import { TagIcon } from '@heroicons/react/24/solid';
import { secondsToTime } from '../util/helper';
import Modal from './Modal';

const ObjectionModal = ({ open = false, data = [], onClose, field, title }) => {
  const getModalBody = () => {
    return (
      <ul role="list">
        {data.map((item) => (
          <li key={item.id} className="py-4 list-decimal flex">
            <div className="grow">
              <span class="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 mr-2 w-[100px] text-center justify-center">
                {secondsToTime(item?.start_seconds)} - {secondsToTime(item?.end_seconds)}
              </span>
              <span className="text-sm">{item[field]}</span>
            </div>
            {item?.main_category && (
              <span class="w-[150px] text-center justify-center inline-flex items-center gap-x-1.5 rounded-md bg-indigo-100 px-1.5 ml-6 py-0.5 text-xs font-medium text-indigo-700">
                <TagIcon className="h-4 w-4" />
                {item?.main_category}
              </span>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Modal
      show={open}
      title={title}
      body={getModalBody()}
      hideCancelBtn={true}
      hideCloseBtn={false}
      onClose={onClose}
    />
  );
};

export default ObjectionModal;
