import { useNodePerformance } from '../../hooks/useNodePerformance';
import { useNodeVersion } from '../../hooks/useNodeVersion';
import { Doughnut } from 'react-chartjs-2';
import { mapToDoughnut } from '../../utils/mapToDoughnut';
import { nullPlaceholder } from '../../utils/null-placerholder';
import { useNodeStatus } from '../../hooks/useNodeStatus';
import { useNodeNetwork } from '../../hooks/useNodeNetwork';

export const getServerSideProps = () => ({
  props: {apiPort: process.env.PORT},
});

export default function Performance({apiPort}: any) {
  const {version} = useNodeVersion(apiPort)
  const {nodeStatus} = useNodeStatus(apiPort)
  const {performance} = useNodePerformance(apiPort)
  const {network} = useNodeNetwork(apiPort)

  return <>{!!(performance && nodeStatus && version) && <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col items-stretch">
              <h1 className="font-semibold mb-3">Version Info</h1>
              <div
                  className="bg-white text-stone-500 rounded-xl p-8 text-sm [&>*]:pb-2 flex flex-col flex-grow justify-center">
                  <div><span className='font-semibold'>CLI/GUI Running version:</span> {nullPlaceholder(version.runningCliVersion)} / {nullPlaceholder(version.runningGuiVersion)}</div>
                  <div><span className='font-semibold'>CLI/GUI Latest version:</span> {nullPlaceholder(version.latestCliVersion)} / {nullPlaceholder(version.latestGuiVersion)}</div>
                  <div><span className='font-semibold'>Validator Running version:</span> {nullPlaceholder(nodeStatus.nodeInfo?.appData?.activeVersion)}</div>
                  <div><span className='font-semibold'>Validator Latest version:</span> {nullPlaceholder(nodeStatus.nodeInfo?.appData?.shardeumVersion)}</div>
                  <div><span className='font-semibold'>Validator Minimum version:</span> {nullPlaceholder(nodeStatus.nodeInfo?.appData?.minVersion)}</div>
              </div>
          </div>
          <div className="flex flex-col items-stretch">
              <h1 className="font-semibold mb-3">Performance</h1>
              <div
                  className="bg-white text-stone-500	rounded-xl p-8 text-sm [&>*]:pb-2 flex flex-col flex-grow justify-center">
                  <div className="flex justify-between h-7">
                      <div><span className='font-semibold'>CPU usage AVG:</span> {nodeStatus.performance?.cpuPercentage.toFixed(2)}%</div>
                      <Doughnut data={mapToDoughnut(nodeStatus.performance?.cpuPercentage, {spacing: 2})}/>
                  </div>
                  <div className="flex justify-between h-7">
                      <div><span className='font-semibold'>RAM usage AVG:</span> {nodeStatus.performance?.memPercentage.toFixed(2)}%</div>
                      <Doughnut data={mapToDoughnut(nodeStatus.performance?.memPercentage, {spacing: 2})}/>
                  </div>
                  <div className="flex justify-between h-7">
                      <div><span className='font-semibold'>Disk usage AVG:</span> {nodeStatus.performance?.diskPercentage.toFixed(2)}%</div>
                      <Doughnut data={mapToDoughnut(nodeStatus.performance?.diskPercentage, {spacing: 2})}/>
                  </div>
                  <div className="flex justify-between h-7">
                      <div><span className='font-semibold'>Network usage AVG:</span> {performance[0]?.network}%</div>
                      <Doughnut data={mapToDoughnut(performance[0]?.network, {spacing: 2})}/>
                  </div>
              </div>
          </div>
          <div className="flex flex-col items-stretch">
              <h1 className="font-semibold mb-3">TPS Overview</h1>
              <div
                  className="bg-white text-stone-500	rounded-xl p-8 text-sm [&>*]:pb-2 flex flex-col flex-grow justify-center">
                  <div><span className='font-semibold'>Node
                      throughput:</span> {network?.txApplied ? network?.txApplied + ' TPS' : '-'}</div>
                  <div><span className='font-semibold'>Transaction processed:</span> {nullPlaceholder(nodeStatus.performance?.transactionsCount)}</div>
                  <div><span className='font-semibold'>State storage usage:</span> {nullPlaceholder(nodeStatus.performance?.stateStorage)}</div>
              </div>
          </div>
      </div>

      <h1 className="font-semibold mb-3 py-10">Performance</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="relative aspect-square">
              <div className="flex absolute justify-center items-center w-full h-full font-bold text-lg">CPU</div>
              <Doughnut data={mapToDoughnut(nodeStatus.performance?.cpuPercentage)}/>
          </div>
          <div className="aspect-square relative">
              <div className="flex absolute justify-center items-center w-full h-full font-bold text-lg">RAM</div>
              <Doughnut data={mapToDoughnut(nodeStatus.performance?.memPercentage)}/>
          </div>
          <div className="aspect-square relative">
              <div className="flex absolute justify-center items-center w-full h-full font-bold text-lg">DISK</div>
              <Doughnut data={mapToDoughnut(nodeStatus.performance?.diskPercentage)}/>
          </div>
          <div className="aspect-square relative">
              <div className="flex absolute justify-center items-center w-full h-full font-bold text-lg">NETWORK</div>
              <Doughnut data={mapToDoughnut(performance[0]?.network)}/>
          </div>
      </div>
  </div>
  }
  </>
}
