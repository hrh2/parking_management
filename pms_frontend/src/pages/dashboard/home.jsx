import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Progress,
  Spinner, Button,
} from "@material-tailwind/react";
import { StatisticsCard } from "@/widgets/cards";
import { StatisticsChart } from "@/widgets/charts";
import {
  statisticsChartsData,
} from "@/data";
import { ClockIcon } from "@heroicons/react/24/solid";
import { API_ENDPOINTS } from "@/configs/server_api";
import { fetchData } from "@/utils/helpers";
import { 
  BanknotesIcon,
  UsersIcon,
  UserCircleIcon,
  TruckIcon,
} from "@heroicons/react/24/solid";
import {usePopup} from "@/context/PopupContext.jsx";
import {AddVehicleForm} from "@/widgets/cards/AddVehicle.jsx";
import {AddStationForm} from "@/widgets/cards/AddStation.jsx";

export function Home() {
  const { showPopup } = usePopup();

  const handleClick = () => {
    showPopup(
        <AddStationForm/>
    );
  };

  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("pms_auth_token");
        const response = await fetchData(API_ENDPOINTS.ADMIN.REPORTS, token);

        if (response.error) {
          setError(response.error);
        } else {
          setReportData(response.data);
        }
      } catch (err) {
        setError("Failed to fetch report data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  // Generate monthly revenue chart data
  const generateMonthlyRevenueChart = () => {
    if (!reportData || !reportData.monthlyRevenue) return null;

    // Sort months chronologically
    const sortedMonths = Object.keys(reportData.monthlyRevenue)
      .sort((a, b) => {
        const [yearA, monthA] = a.split('-').map(Number);
        const [yearB, monthB] = b.split('-').map(Number);
        return yearA !== yearB ? yearA - yearB : monthA - monthB;
      })
      .slice(-9); // Get last 9 months for better visualization

    // Get month names
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const categories = sortedMonths.map(key => {
      const [year, month] = key.split('-').map(Number);
      return monthNames[month - 1];
    });

    // Get revenue values
    const data = sortedMonths.map(key => reportData.monthlyRevenue[key] || 0);

    return {
      type: "line",
      height: 220,
      series: [
        {
          name: "Revenue",
          data: data,
        },
      ],
      options: {
        chart: {
          toolbar: {
            show: false,
          },
        },
        colors: ["#0288d1"],
        stroke: {
          lineCap: "round",
          curve: "smooth",
        },
        markers: {
          size: 5,
        },
        xaxis: {
          categories: categories,
          labels: {
            style: {
              colors: "#616161",
              fontSize: "12px",
              fontFamily: "inherit",
              fontWeight: 400,
            },
          },
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
        },
        yaxis: {
          labels: {
            style: {
              colors: "#616161",
              fontSize: "12px",
              fontFamily: "inherit",
              fontWeight: 400,
            },
          },
        },
        grid: {
          show: true,
          borderColor: "#dddddd",
          strokeDashArray: 5,
          xaxis: {
            lines: {
              show: true,
            },
          },
          padding: {
            top: 5,
            right: 20,
          },
        },
        fill: {
          opacity: 0.8,
        },
        tooltip: {
          theme: "dark",
        },
      },
    };
  };

  // Create statistics cards data from report data
  const generateStatisticsCards = () => {
    if (!reportData) return [];

    return [
      {
        color: "blue",
        icon: UsersIcon,
        title: "Total Users",
        value: reportData.totalUsers || 0,
        footer: {
          color: "text-green-500",
          value: `+${reportData.newUsers || 0}`,
          label: "new today",
        },
      },
      {
        color: "green",
        icon: UserCircleIcon,
        title: "Verified Users",
        value: reportData.verifiedUsers || 0,
        footer: {
          color: "text-green-500",
          value: `${Math.round((reportData.verifiedUsers / reportData.totalUsers) * 100)}%`,
          label: "verification rate",
        },
      },
      {
        color: "orange",
        icon: BanknotesIcon,
        title: "Total Revenue",
        value: `${reportData.totalRevenue || 0} FRW`,
        footer: {
          color: "text-green-500",
          value: "",
          label: "from all tickets",
        },
      },
      {
        color: "purple",
        icon: TruckIcon,
        title: "Total Vehicles",
        value: reportData.totalVehicles || 0,
        footer: {
          color: "text-green-500",
          value: "",
          label: "registered vehicles",
        },
      },
    ];
  };

  return (
    <div className="mt-12">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner className="h-12 w-12" />
        </div>
      ) : error ? (
        <div className="text-center text-red-500 p-4 bg-red-50 rounded-lg">
          <p className="text-xl font-semibold">Error</p>
          <p>{error}</p>
        </div>
      ) : (
        <>
          <div className="flex justify-start pr-6">
            <Button
                color="gray"
                className="rounded-full"
                onClick={handleClick}
            >
              Add Vehicle
            </Button>
          </div>
          {/* Statistics Cards */}
          <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
            {generateStatisticsCards().map(({ icon, title, value, footer, color }) => (
              <StatisticsCard
                key={title}
                color={color}
                title={title}
                value={value}
                icon={React.createElement(icon, {
                  className: "w-6 h-6 text-white",
                })}
                footer={
                  <Typography className="font-normal text-blue-gray-600">
                    {footer.value && (
                      <strong className={footer.color}>{footer.value}</strong>
                    )}
                    &nbsp;{footer.label}
                  </Typography>
                }
              />
            ))}
          </div>

          {/* Charts and Additional Cards */}
          <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
            {/* Monthly Revenue Chart */}
            {reportData && reportData.monthlyRevenue && (
              <StatisticsChart
                key="monthly-revenue"
                color="blue"
                title="Monthly Revenue"
                description="Revenue trend over the past months"
                chart={generateMonthlyRevenueChart()}
                footer={
                  <Typography
                    variant="small"
                    className="flex items-center font-normal text-blue-gray-600"
                  >
                    <ClockIcon strokeWidth={2} className="h-4 w-4 text-blue-gray-400" />
                    &nbsp;Updated with latest data
                  </Typography>
                }
              />
            )}

            {/* New Users Today Card */}
            {reportData && (
              <Card className="overflow-hidden">
                <CardHeader
                  floated={false}
                  shadow={false}
                  color="transparent"
                  className="m-0 p-6"
                >
                  <Typography variant="h6" color="blue-gray" className="mb-2">
                    New Users Today
                  </Typography>
                  <Typography variant="h4" color="blue-gray">
                    {reportData.newUsers || 0}
                  </Typography>
                </CardHeader>
                <CardBody className="pt-0">
                  <div className="flex items-center justify-between">
                    <Typography className="text-sm text-gray-600">
                      {reportData.newClientsToday || 0} new clients registered today
                    </Typography>
                    <Typography className="text-sm font-medium text-blue-500">
                      {Math.round((reportData.newUsers / reportData.totalUsers) * 100)}% of total users
                    </Typography>
                  </div>
                  <Progress
                    value={Math.round((reportData.newUsers / reportData.totalUsers) * 100)}
                    size="sm"
                    color="blue"
                    className="mt-2"
                  />
                </CardBody>
              </Card>
            )}

            {/* Keep other charts if needed */}
            {statisticsChartsData.map((props) => (
              <StatisticsChart
                key={props.title}
                {...props}
                footer={
                  <Typography
                    variant="small"
                    className="flex items-center font-normal text-blue-gray-600"
                  >
                    <ClockIcon strokeWidth={2} className="h-4 w-4 text-blue-gray-400" />
                    &nbsp;{props.footer}
                  </Typography>
                }
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
