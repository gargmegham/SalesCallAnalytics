import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function Modal({
  show = false,
  icon,
  title,
  body,
  hideCancelBtn,
  hideCloseBtn,
  onClose,
  onAction,
  actionText,
  actionColor,
}) {
  const [open, setOpen] = useState(show);

  useEffect(
    function () {
      setOpen(show);
    },
    [show]
  );

  const closeModal = () => {
    setOpen(false);
    if (onClose) onClose();
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full mx-auto items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 w-8/12 sm:p-6">
                {!hideCloseBtn && (
                  <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                    <button
                      type="button"
                      className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={closeModal}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                )}

                <div className="sm:flex sm:items-start">
                  {icon && (
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      {icon}
                    </div>
                  )}
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                    {title && (
                      <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                        {title}
                      </Dialog.Title>
                    )}
                    <div className="mt-2">{body}</div>
                  </div>
                </div>

                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  {onAction && (
                    <button
                      type="button"
                      className={`
                        inline-flex
                        w-full
                        justify-center
                        rounded-md
                        px-3
                        py-2
                        text-sm
                        font-semibold
                        text-white
                        shadow-sm
                        sm:ml-3
                        sm:w-auto
                        ${
                          actionColor
                            ? `bg-${actionColor}-600 hover:bg-${actionColor}-500`
                            : 'bg-indigo-600 hover:bg-indigo-500'
                        } `}
                      onClick={onAction}
                    >
                      {actionText ? actionText : 'Click'}
                    </button>
                  )}
                  {!hideCancelBtn && (
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
