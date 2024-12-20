"use client";

import Provider from "@/components/form/Provider";
import Spinner from "@/components/form/Spinner";
import PostalCodeForm from "@/components/reservation/PostalCodeForm";
import { getUserSession } from "@/lib/session";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";

// const client = new Client({});
// const response = client.distancematrix({
//   params: {
//     origins: ["Montreal"],
//     destinations: ["Laval"],
//   },
// });
// console.log(response);

export default function ReservationForm() {
  
  const [location, setLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [typeVehicle, setTypeVehicle] = useState("");
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [additionalFeatures, setAdditionalFeatures] = useState<string[]>([]);

  const router = useRouter();

  const handleChange = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = event.target;
    switch (name) {
      case "location":
        setLocation(value);
        break;
      case "pickupDate":
        setPickupDate(value);
        break;
      case "returnDate":
        setReturnDate(value);
        break;
      case "typeVehicle":
        setTypeVehicle(value);
        break;
      case "category":
        setCategory(value);
        break;
      case "priceRange":
        setPriceRange(value);
        break;
      default:
        break;
    }
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    if (checked) {
      setAdditionalFeatures([...additionalFeatures, value]);
    } else {
      setAdditionalFeatures(additionalFeatures.filter((feature) => feature !== value));
    }
  };

  // const handleSearch = async () => {

  //   const postalCode = (document.getElementsByName("postalCode")[0] as HTMLInputElement).value;
  //   const key = process.env.GOOGLE_API_KEY;
  //   console.log(key);
  //   const pcBranch1 = "H4Y1H1";
  //   const pcBranch2 = "H7T2Y5";
  //   const pcBranch3 = "H9R5J2";

  //   //In order to use the "Search Nearest Branch" feature, assuming Google Chrome is being used, one will need to install the "Allow CORS: Access-Control-Allow-Origin" extension and enable it.

  //   try {

  //     //Time from Montreal branch
  //     const response1 = await axios.get(
  //     `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${postalCode}&destinations=${pcBranch1}&key=${key}`)
  //     const duration1 = response1.data.rows[0].elements[0].duration.text;

  //     //Time from Laval branch
  //     const response2 = await axios.get(
  //     `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${postalCode}&destinations=${pcBranch2}&key=${key}`)
  //     const duration2 = response2.data.rows[0].elements[0].duration.text;

  //     //Time from West Island branch
  //     const response3 = await axios.get(
  //     `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${postalCode}&destinations=${pcBranch3}&key=${key}`)
  //     const duration3 = response3.data.rows[0].elements[0].duration.text;

  //     //Find nearest branch
  //     const durations = [duration1, duration2, duration3];
  //     const minDuration = Math.min(...durations.map(duration => parseInt(duration)));
  //     const minDurationIndex = durations.findIndex(duration => parseInt(duration) === minDuration);
  //     const minDurationName = `duration${minDurationIndex + 1}`;
  //     const nearestBranch = minDurationName === "duration1" ? "Montreal" : minDurationName === "duration2" ? "Laval" : "West Island";

  //     alert(duration1 + " to Montreal Branch\n" + duration2 + " to Laval Branch\n" + duration3 + " to West Island Branch\n\n" + "The nearest branch is located in: " + nearestBranch);
  //   }

  //   catch (error) {
  //     console.error(error);
  //   }

  // };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget);
    const newLocation = formData.get("location") as string;
    const newPickupDate = formData.get("pickupDate") as string;
    const newReturnDate = formData.get("returnDate") as string;
    const newType = formData.get("typeVehicle") as string;
    const newCategory = formData.get("categoryDropdown") as string;
    const newPriceRange = formData.get("priceRange") as string;

    setLocation(newLocation);
    setPickupDate(newPickupDate);
    setReturnDate(newReturnDate);
    setTypeVehicle(newType);
    setCategory(newCategory);
    setPriceRange(newPriceRange);

    // console.log(location);
    // console.log(pickupDate);
    // console.log(returnDate);
    // console.log(typeVehicle);
    // console.log(category);
    // console.log(priceRange);
    // for (let feature of additionalFeatures) {
    //   console.log(feature);
    // }
    //make it go to the next page that displays cars now

    const data = {
      location: location,
      pickupDate: pickupDate,
      returnDate: returnDate,
      typeVehicle: typeVehicle,
      category: category,
      priceRange: priceRange,
      additionalFeatures: additionalFeatures,
    };
    console.log(data);
    router.push(
      `/reservationPage?location=${location}&type=${typeVehicle}&category=${category}&priceRange=${priceRange}&pickupDate=${pickupDate}&returnDate=${returnDate}&additionalFeatures=${additionalFeatures}`
    );
  };
  
  return (
    <div className="grid h-screen place-items-center bg-sky-100">
      <div className="rounded-lg border-t-4 border-sky-900 bg-slate-100 p-5 shadow-lg">
        <h1 className="my-4 text-4xl font-bold">Reservation</h1>
        <PostalCodeForm></PostalCodeForm>
        <Provider formAction={handleSubmit}>
          <Spinner />
          {/* <input
            type="text"
            className="rounded-md border-2 p-3 text-gray-400"
            name="postalCode"
            placeholder="Enter a Location"
          />
          <button
            type="button"
            className="cursor-pointer rounded-lg bg-sky-900 px-6 py-2 font-bold text-white hover:bg-sky-950"
            onClick={handleSearch}
          >
            Search Nearest Branch
          </button> */}
          <select
            id="locationDropdown"
            className="rounded-md border-2 p-3 text-gray-400 bg-white"
            name={"location"}
            required
            onChange={handleChange}
          >
            <option value="" disabled selected>
              Select a Location
            </option>
            <option value="Montreal">Montreal (H4Y 1H1) </option>
            <option value="Laval">Laval (H7T 2Y5) </option>
            <option value="West-Island">West Island (H9R 5J2) </option>
          </select>
          Pickup Date
          <input
            type="date"
            className="rounded-md border-2 p-3 text-gray-400 bg-slate-300"
            name="pickupDate"
            placeholder="Pickup Date"
            required
            onChange={handleChange}
          />
          Return Date
          <input
            type="date"
            className="rounded-md border-2 p-3 text-gray-400 bg-slate-300"
            name="returnDate"
            placeholder="Return Date"
            required
            onChange={handleChange}
          />
          <select
            id="typeDropdown"
            className="rounded-md border-2 p-3 text-gray-400 bg-white"
            name={"typeVehicle"}
            required
            onChange={handleChange}
          >
            <option value="" disabled selected>
              Select a Type
            </option>
            <option value="Car">Car</option>
            <option value="Suv">SUV</option>
            <option value="Van">Van</option>
            <option value="Truck">Truck</option>
          </select>
          <select
            id="categoryDropdown"
            className="rounded-md border-2 p-3 text-gray-400 bg-white"
            name={"category"}
            required
            onChange={handleChange}
          >
            <option value="" disabled selected>
              Select a Category
            </option>
            <option value="Compact">Compact</option>
            <option value="Standard">Standard</option>
            <option value="Intermediate">Intermediate</option>
          </select>
          <select
            id="priceDropdown"
            className="rounded-md border-2 p-3 text-gray-400 bg-white"
            name={"priceRange"}
            required
            onChange={handleChange}
          >
            <option value="Select a Price Range ($/day)" disabled selected>
              Select a Price Range ($/day)
            </option>
            <option value="30-50">30$ to 50$</option>
            <option value="51-80">51$ to 80$</option>
            <option value="81-120">81$ to 120$</option>
            <option value="121-and-more">121$ and More</option>
          </select>
          <button
            type="submit"
            className="cursor-pointer rounded-lg bg-sky-900 px-6 py-2 font-bold text-white hover:bg-sky-950"
          >
            Submit
          </button>
        </Provider>
      </div>
    </div>
  );
}
