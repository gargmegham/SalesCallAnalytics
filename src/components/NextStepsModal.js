import { secondsToTime } from '../util/helper';
import Modal from './Modal';

const NextStepsModal = ({ open = false, data = [], onClose, field, title }) => {
  const findIndexOfOneSentenceInAnother = (sentence, text) => {
    const index = text.indexOf(sentence);
    if (index === -1) return -1;
    if (index > 0 && text[index - 1] !== ' ') return -1;
    const index2 = index + sentence?.length;
    if (index2 < text?.length && text[index2] !== ' ') return -1;
    return index;
  };
  const getModalBody = () => {
    return (
      <ul role="list">
        {data.map((item) => (
          <li key={item.id} className="py-4 list-decimal flex">
            <div className="grow">
              <span class="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 mr-2 w-[100px] text-center justify-center">
                {secondsToTime(item?.start_seconds)} - {secondsToTime(item?.end_seconds)}
              </span>
              <span className="text-sm">
                {item[field].slice(0, item[field].indexOf(item['sentence']))}
                <span className="bg-yellow-200">{item['sentence']}</span>
                {item[field].slice(item[field].indexOf(item['sentence']) + item['sentence']?.length)}
              </span>
            </div>
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

export default NextStepsModal;
