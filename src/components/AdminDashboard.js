import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import toast from "react-hot-toast";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [details, setDetails] = useState({});
  const [chargeCustomers, setChargeCustomers] = useState(false);
  const [customAmount, setCustomAmount] = useState(0);
  const [regularAmounts, setRegularAmounts] = useState([0, 0, 0, 0]);
  const { userId } = useParams();

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://stg.dhunjam.in/account/admin/${userId}`
        );
        if (response.status === 200 && response.data.response === "Success") {
          const data = response.data.data;
          console.log(data);
          setDetails(data);
          setChargeCustomers(data.charge_customers);
          setCustomAmount(data.amount.category_6);
          setRegularAmounts([
            data.amount.category_7,
            data.amount.category_8,
            data.amount.category_9,
            data.amount.category_10,
          ]);
        } else {
          // Handle API error
          console.error("Error fetching data from API");
        }
      } catch (error) {
        // Handle error
        console.error("Error during API call", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures the effect runs once on mount

  // Chart

  const option = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Price (₹)",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },

      title: {
        display: false,
      },
    },
  };

  const data = {
    labels: ["Custom", "Category1", "Category2", "Category3", "Category4"],
    datasets: [
      {
        label: "",
        data: [customAmount, ...regularAmounts],
        backgroundColor: "#F0C3F1",
        barThickness: 40,
      },
    ],
  };

  // Handle save button click
  // Handle save button click
  const handleSave = async () => {
    try {
      // Minimum values for custom and regular song request amounts
      const minCustomAmount = 99;
      const minRegularAmounts = [79, 59, 39, 19];

      // Ensure customAmount is a number
      const customAmountValue = Number(customAmount);

      // Ensure all regularAmounts are numbers
      const regularAmountsValues = regularAmounts.map(Number);

      // Check if customAmount is greater than or equal to its minimum value
      const isValidCustomAmount =
        !chargeCustomers || customAmountValue >= minCustomAmount;

      // Check if all regularAmounts are greater than or equal to their respective minimum values
      const isValidRegularAmounts = regularAmountsValues.every(
        (amount, index) =>
          !chargeCustomers || amount >= minRegularAmounts[index]
      );

      if (isValidCustomAmount && isValidRegularAmounts) {
        const response = await axios.put(
          `https://stg.dhunjam.in/account/admin/${details.id}`,
          {
            amount: {
              category_6: customAmount,
              category_7: regularAmounts[0],
              category_8: regularAmounts[1],
              category_9: regularAmounts[2],
              category_10: regularAmounts[3],
            },
          }
        );

        if (response.status === 200 && response.data.response === "Success") {
          // Fetch updated data after save
          const updatedResponse = await axios.get(
            `https://stg.dhunjam.in/account/admin/${details.id}`
          );

          if (
            updatedResponse.status === 200 &&
            updatedResponse.data.response === "Success"
          ) {
            const updatedData = updatedResponse.data.data;
            setDetails(updatedData);
            setCustomAmount(updatedData.amount.category_6);
            setRegularAmounts([
              updatedData.amount.category_7,
              updatedData.amount.category_8,
              updatedData.amount.category_9,
              updatedData.amount.category_10,
            ]);
            console.log(updatedData);
          } else {
            // Handle API error after save
            toast.error("Error fetching updated data after save");
          }
        } else {
          // Handle save failure
          toast.error("Error occured while saving");
          console.error("Save failed");
        }
        toast.success("Saved");
      } else {
        // Display a message or take appropriate action for invalid input
        toast.error("Error occured while saving");
      }
    } catch (error) {
      // Handle error
      console.error("Error during save", error);
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center gap-8">
      <h1 className="font-bold text-[32px] my-5">
        {details.name}, {details.location} on Dhun Jam
      </h1>

      <div className="grid grid-cols-3 place-items-start gap-5">
        {/* 1 */}
        <div className="col-span-2">
          <p className="text-[16px]">
            Do you want to charge your customers for requesting songs?
          </p>
        </div>

        {/* 2 */}
        <div className="flex items-center">
          <label className="flex items-center">
            <input
              className="w-4 h-4 mx-2 text-[#6741D9] bg-[#6741D9] checked:text-[#6741D9] checked:bg-[#6741D9]"
              type="radio"
              value="Yes"
              checked={chargeCustomers}
              onChange={() => setChargeCustomers(true)}
            />
            Yes
          </label>
          <label className="flex items-center">
            <input
              className="w-4 h-4 mx-2 text-[#6741D9] checked:text-[#6741D9] bg-[#6741D9] checked:bg-[#6741D9]"
              type="radio"
              value="No"
              checked={!chargeCustomers}
              onChange={() => setChargeCustomers(false)}
            />
            No
          </label>
        </div>

        {/* 3 */}
        <div className="col-span-2">
          <p
            className={`text-[16px]  ${
              !chargeCustomers && "border-gray-400 text-[#C2C2C2]"
            }`}
          >
            Custom song request amount:
          </p>
        </div>

        {/* 4 */}
        <div>
          <input
            className={`w-[4rem] text-center bg-transparent text-[#FFFFFF] border border-white rounded-xl p-1 ${
              !chargeCustomers &&
              "cursor-not-allowed border-gray-400 text-[#C2C2C2]"
            }`}
            type="number"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            disabled={!chargeCustomers}
          />
        </div>

        {/* 5 */}
        <div className="col-span-2">
          <p
            className={`text-[16px]  ${
              !chargeCustomers && "border-gray-400 text-[#C2C2C2]"
            }`}
          >
            Regular song request amounts, from high to low:
          </p>
        </div>

        {/* 6 */}
        <div className="flex gap-4">
          {regularAmounts.map((amount, index) => (
            <input
              className={`w-[4rem] text-center bg-transparent text-[#FFFFFF] border border-white rounded-xl p-1 ${
                !chargeCustomers &&
                "cursor-not-allowed border-gray-400 text-[#C2C2C2]"
              }`}
              key={index}
              type="number"
              value={amount}
              onChange={(e) => {
                const newAmounts = [...regularAmounts];
                newAmounts[index] = e.target.value;
                setRegularAmounts(newAmounts);
              }}
              disabled={!chargeCustomers}
            />
          ))}
        </div>
      </div>

      {/* Graph */}

      <div className="w-[40%] h-auto mx-auto mb-10">
        {chargeCustomers && <Bar options={option} data={data} />}
      </div>

      <button
        className={`text-[16px] w-[40%] p-3 rounded-xl font-bold ${
          chargeCustomers
            ? "bg-[#6741D9]"
            : "bg-[#C2C2C2] text-[#000000] cursor-not-allowed"
        } hover:border border-[#F0C3F1]`}
        type="button"
        onClick={handleSave}
        disabled={!chargeCustomers}
      >
        Save
      </button>
    </div>
  );
};

export default AdminDashboard;
