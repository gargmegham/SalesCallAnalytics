import { ArrowDownTrayIcon, ArrowLeftCircleIcon } from '@heroicons/react/24/solid';
import DashStatModal from '../components/DashStatModal';
import ObjectionModal from '../components/ObjectionModal';
import NextStepsModal from '../components/NextStepsModal';
import Loader from '../components/Loader';
import { useEffect, useState } from 'react';
import PieChart from '../components/PieChart';
import BarChart from '../components/BarChart';
import { useParams } from 'react-router-dom';
import { fetchInsights as fetchInsightsApi } from '../api';
import Quotes from '../components/Quotes';

const Dashboard = () => {
  let { key } = useParams();
  const [openModal, setOpenModal] = useState(false);
  const [openObjModal, setOpenObjModal] = useState(false);
  const [openNextStepsModal, setOpenNextStepsModal] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [dashboardData, setDashboardData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsights();
  }, [key]);

  const fetchInsights = async () => {
    try {
      const data = await fetchInsightsApi(key);
      setDashboardData(data);
    } finally {
      setLoading(false);
    }
  };

  const onStatClick = (list, field, title) => {
    setModalData({ data: list, field, title });
    setTimeout(() => {
      if (field === 'objection') setOpenObjModal(true);
      else if (field === 'segment') setOpenNextStepsModal(true);
      else setOpenModal(true);
    });
  };

  const downloadTranscript = () => {
    const element = document.createElement('a');
    const file = new Blob([dashboardData.transcript], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'transcript.txt';
    document.body.appendChild(element);
    element.click();
  };

  return loading ? (
    <div className="flex justify-center items-center h-screen">
      <Loader className="w-90 h-90" />
    </div>
  ) : (
    <>
      <header className="bg-white shadow-xl">
        <div className="mx-auto max-w-8xl px-4 py-6 sm:px-6 lg:px-10 flex">
          <a href="/">
            <ArrowLeftCircleIcon className="h-10 w-10" aria-hidden="true" />
          </a>
          <h1 className="text-center text-3xl font-bold tracking-tight text-gray-900 w-full">Sales Call Analytics</h1>
        </div>
      </header>
      <main className="mx-auto max-w-[1560px]">
        <div className="px-4 py-8 sm:px-6 lg:px-10">
          <div className="mb-10">
            <h3 className="text-right font-semibold leading-6 text-gray-900">
              <button
                type="button"
                className="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={downloadTranscript}
              >
                <ArrowDownTrayIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                Download Transcript
              </button>
            </h3>
            <dl className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-3">
              <div
                className="overflow-hidden rounded-lg bg-slate-100 px-4 py-5 border-1 border-gray-100 shadow-xl sm:p-6 text-center hover:shadow-lg cursor-pointer"
                onClick={() => onStatClick(dashboardData?.questions, 'question', 'Questions')}
              >
                <dd className="text-4xl font-bold tracking-tight text-gray-900">{dashboardData?.questions?.length}</dd>
                <dt className="mt-2 truncate text-sm font-semibold text-gray-700">Questions Asked</dt>
              </div>
              <div
                className="overflow-hidden rounded-lg bg-slate-100 px-4 py-5 border-1 border-gray-100 shadow-xl sm:p-6 text-center hover:shadow-lg cursor-pointer"
                onClick={() => onStatClick(dashboardData?.objections, 'objection', 'Objections')}
              >
                <dd className="text-4xl font-bold tracking-tight text-gray-900">{dashboardData?.objections?.length}</dd>
                <dt className="mt-2 truncate text-sm font-semibold text-gray-700">Objections Made</dt>
              </div>
              <div
                className="overflow-hidden rounded-lg bg-slate-100 px-4 py-5 border-1 border-gray-100 shadow-xl sm:p-6 text-center hover:shadow-lg cursor-pointer"
                onClick={() => onStatClick(dashboardData?.next_steps, 'segment', 'Next Steps')}
              >
                <dd className="text-4xl font-bold tracking-tight text-gray-900">{dashboardData?.next_steps?.length}</dd>
                <dt className="mt-2 truncate text-sm font-semibold text-gray-700">Next Steps</dt>
              </div>
            </dl>
          </div>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-4 p-10 bg-slate-100 shadow-xl rounded-xl hover:shadow-lg h-[400px]">
              <Quotes list={dashboardData?.customer_insights} />
            </div>
            <div className="col-span-12 lg:col-span-4 bg-slate-100 shadow-xl rounded-xl hover:shadow-lg h-[400px]">
              <div className="flex flex-row justify-between items-center h-full p-10">
                <BarChart
                  data={{
                    data: dashboardData.quantitative_objection_categories,
                  }}
                />
              </div>
            </div>
            <div className="col-span-12 lg:col-span-4 bg-slate-100 shadow-xl rounded-xl hover:shadow-lg h-[400px]">
              <div className="flex flex-row justify-between items-center h-full p-10">
                <PieChart
                  data={{
                    data: [
                      { label: 'Seller Talk %', value: dashboardData.seller_talk_pct * 100 },
                      { label: 'Buyer Talk %', value: dashboardData.buyer_talk_pct * 100 },
                    ],
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <DashStatModal open={openModal} {...modalData} onClose={() => setOpenModal(false)} />
      <ObjectionModal open={openObjModal} {...modalData} onClose={() => setOpenObjModal(false)} />
      <NextStepsModal open={openNextStepsModal} {...modalData} onClose={() => setOpenNextStepsModal(false)} />
    </>
  );
};

export default Dashboard;
