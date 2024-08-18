import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function Home() {
    const [farms, setFarms] = useState([]);
    const [ponds, setPonds] = useState([]);
    const [fish, setFish] = useState([]);
    const [cultureCycles, setCultureCycles] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const farmRes = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/farm/all`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const pondRes = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/pond/all`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const fishRes = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/fish/all`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const cultureCycleRes = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/culture-cycle/all`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setFarms(farmRes.data);
                setPonds(pondRes.data);
                setFish(fishRes.data);
                setCultureCycles(cultureCycleRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    // Calculate statistics
    const totalFarms = farms.length;
    const totalPonds = ponds.length;
    const totalFishSpecies = fish.length;
    const totalCultureCycles = cultureCycles.length;

    // Prepare data for chart: Number of ponds per farm
    const pondsPerFarm = useMemo(() => {
        const farmPondCounts = {};
        console.log(ponds);
        farms.forEach(farm => {
            farmPondCounts[farm.name] = ponds.filter(pond => pond.farm_id._id === farm._id).length;
        });

        return {
            labels: Object.keys(farmPondCounts),
            datasets: [
                {
                    label: 'Number of Ponds per Farm',
                    data: Object.values(farmPondCounts),
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                },
            ],
        };
    }, [farms, ponds]);

    // Prepare data for chart: Number of fish species per culture cycle
    const fishPerCultureCycle = useMemo(() => {
        const cycleFishCounts = {};
        cultureCycles.forEach(cycle => {
            cycleFishCounts[cycle.name] = cycle.fish.length;
        });

        return {
            labels: Object.keys(cycleFishCounts),
            datasets: [
                {
                    label: 'Number of Fish Species per Culture Cycle',
                    data: Object.values(cycleFishCounts),
                    backgroundColor: 'rgba(153, 102, 255, 0.6)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1,
                },
            ],
        };
    }, [cultureCycles]);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Aquaculture Management Dashboard</h2>

            {/* Summary Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="p-4 bg-blue-100 rounded shadow">
                    <h3 className="text-lg font-semibold">Total Farms</h3>
                    <p className="text-2xl">{totalFarms}</p>
                </div>
                <div className="p-4 bg-green-100 rounded shadow">
                    <h3 className="text-lg font-semibold">Total Ponds</h3>
                    <p className="text-2xl">{totalPonds}</p>
                </div>
                <div className="p-4 bg-yellow-100 rounded shadow">
                    <h3 className="text-lg font-semibold">Total Fish Species</h3>
                    <p className="text-2xl">{totalFishSpecies}</p>
                </div>
                <div className="p-4 bg-purple-100 rounded shadow">
                    <h3 className="text-lg font-semibold">Total Culture Cycles</h3>
                    <p className="text-2xl">{totalCultureCycles}</p>
                </div>
            </div>

            {/* Charts in a row */}
            <div className="flex flex-col lg:flex-row gap-4 mb-8">
                {/* Chart: Number of Ponds per Farm */}
                <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-4">Number of Ponds per Farm</h3>
                    <Bar data={pondsPerFarm} />
                </div>

                {/* Chart: Number of Fish Species per Culture Cycle */}
                <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-4">Number of Fish Species per Culture Cycle</h3>
                    <Bar data={fishPerCultureCycle} />
                </div>
            </div>
        </div>
    );
}

export default Home;
