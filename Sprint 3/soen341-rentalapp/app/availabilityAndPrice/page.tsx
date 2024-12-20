"use client";

import { getAllReservations } from "@/lib/actions/reservationActions";
import { getAllVehicles } from "@/lib/actions/vehicleCRUD";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function availabilityAndPrice({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | undefined };
}) {
  const [vehicle, setVehicle] = useState<
    | {
        _id: string;
        model: string;
        type: string;
        category: string;
        price: string;
        pictureURL: string;
      }
    | undefined
  >();
  const [isAvailable, setIsAvailable] = useState(true);
  const [hasInsurance, setHasInsurance] = useState(false);
  const [hasGPS, setHasGPS] = useState(false);
  const [hasWifi, setHasWifi] = useState(false);
  const [additionalPrice, setAdditionalPrice] = useState(0);
  useEffect(() => {
    const fetchVehicle = () => {
      return getAllVehicles({})
        .then(({ vehicles, count, totalPages }) => {
          const foundVehicle = vehicles.find((vehicle) => vehicle._id === searchParams["carId"]);
          setVehicle(foundVehicle);
        })
        .catch((error) => {
          console.error("Failed to fetch vehicles:", error);
        });
    };
    const fetchReservations = () => {
      return getAllReservations({})
        .then(({ reservations, count, totalPage }) => {
          const reservationsArr = reservations.filter(
            (reservation) => reservation.vehicleID === searchParams["carId"]
          );
          console.log(reservationsArr, "reservationsArr");
          checkIsAvailable(dateOfPickup, dateOfDropoff, reservationsArr);
        })
        .catch((error) => {
          console.error("Failed to fetch vehicles:", error);
        });
    };

    fetchVehicle();
    fetchReservations();
  }, []);
  useEffect(() => {
    checkAdditionalFeaturesAndTotalPrice(featuresArr);
  }, []);
  const checkIsAvailable = (pickupDate: Date, returnDate: Date, reservations: any) => {
    console.log(pickupDate, returnDate, reservations);
    if (pickupDate >= returnDate) {
      setIsAvailable(false); // Invalid date range, set availability to false
    } else {
      const available = !(reservations ?? []).some((reservation: any) => {
        const reservationPickupDate = new Date(reservation.pickupDate);
        const reservationReturnDate = new Date(reservation.endDate);
        return (
          (pickupDate >= reservationPickupDate && pickupDate < reservationReturnDate) ||
          (returnDate > reservationPickupDate && returnDate <= reservationReturnDate) ||
          (pickupDate <= reservationPickupDate && returnDate >= reservationReturnDate)
        );
      });

      setIsAvailable(available); // Update the availability state once
    }
  };

  const vehicleID = searchParams["carId"] || "";
  const dateOfPickup = new Date(searchParams["pickupDate"] || "");
  const formattedPickupDate = dateOfPickup.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const dateOfDropoff = new Date(searchParams["returnDate"] || "");
  const formattedDropoffDate = dateOfDropoff.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const reservationDuration = Math.ceil(
    (dateOfDropoff.getTime() - dateOfPickup.getTime()) / (1000 * 60 * 60 * 24)
  );
  const chosenBranch = (searchParams["branch"] as string) || "";
  const featuresStr = searchParams["additionalServices"];
  const featuresArr: string[] = featuresStr?.split(",") ?? [];
  const carPrice = vehicle?.price;
  const pictureUrl = vehicle?.pictureURL;
  //if (!session) return <div>Session Expired! Please Log In</div>;
  const router = useRouter();
  const onConfirm = () => {
    router.push(
      `/providePaymentPage?vehicleID=${vehicleID}&pickupDate=${dateOfPickup.toString()}&endDate=${dateOfDropoff.toString()}
       &extraFeatures=${featuresStr}&branch=${chosenBranch}&price=${reservationDuration * Number(carPrice) + additionalPrice}`
    );
  };
  const checkAdditionalFeaturesAndTotalPrice = (features: string[]) => {
    console.log(features, "features");
    setAdditionalPrice(0);
    let totalAdditionalPrice = 0;
    features.forEach((feature) => {
      if (feature === "Insurance") {
        setHasInsurance(true);
        totalAdditionalPrice += 50;
      } else if (feature === "GPS") {
        setHasGPS(true);
        totalAdditionalPrice += 50;
      } else if (feature === "Wifi") {
        setHasWifi(true);
        totalAdditionalPrice += 50;
      }
    });
    setAdditionalPrice(totalAdditionalPrice);
  };
  return isAvailable ? (
    <div className="h-screen bg-sky-100">
      <div className="ml-40 flex justify-center">
        <div className="w-1/2">
          <table className="mt-20 w-full">
            <tbody>
              <tr>
                <td className="py-2 text-4xl font-bold">Reservation Details</td>
                <td className="py-2 text-4xl font-bold">Info</td>
              </tr>
              <tr>
                <td className="py-2">Pickup and Dropoff Location</td>
                <td className="py-2">{chosenBranch}</td>
              </tr>
              <tr>
                <td className="py-2">Pickup Date</td>
                <td className="py-2">{formattedPickupDate}</td>
              </tr>
              <tr>
                <td className="py-2">Dropoff Date</td>
                <td className="py-2">{formattedDropoffDate}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="w-1/2">
          <table className="mt-20 w-full">
            <tbody>
              <tr>
                <td className="py-2 text-4xl font-bold">Expense Category</td>
                <td className="py-2 text-4xl font-bold">Price</td>
              </tr>
              <tr>
                <td className="py-2">Car (without additional features)</td>
                <td className="py-2">{reservationDuration * Number(carPrice)}$</td>
              </tr>
              {hasInsurance && (
                <tr>
                  <td className="py-2">Insurance</td>
                  <td className="py-2">50$</td>
                </tr>
              )}
              {hasGPS && (
                <tr>
                  <td className="py-2">GPS Navigation</td>
                  <td className="py-2">50$</td>
                </tr>
              )}
              {hasWifi && (
                <tr>
                  <td className="py-2">Wifi HotSpot</td>
                  <td className="py-2">50$</td>
                </tr>
              )}
              <tr>
                <td className="py-2">Total</td>
                <td className="py-2">
                  {reservationDuration * Number(carPrice) + additionalPrice}$
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center justify-center">
        <img src={pictureUrl} className="h-auto w-1/4" />
        <div className="mt-4 flex justify-center">
          <Link href={"/"}>
            {/*goes back to home page for now, fix this*/}
            <button className="rounded bg-red-500 px-4 py-2 text-white">Go Back</button>
          </Link>
          <button onClick={onConfirm} className="ml-4 rounded bg-green-500 px-4 py-2 text-white">
            Confirm
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className="grid h-screen place-items-center bg-sky-100">
      <Link href={"/"}>
        <div className="flex flex-col items-center">
          <div>Car is not available!</div>
          {/*goes back to home page for now, fix this*/}
          <button className="mt-4 rounded bg-red-500 px-4 py-2 text-white">Go Back</button>
        </div>
      </Link>
    </div>
  );
}
