// do the necessary imports
import React, { useEffect } from "react";

//Component for your page
export const StripePricingTable = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.stripe.com/v3/pricing-table.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return React.createElement("stripe-pricing-table", {
    "pricing-table-id": "prctbl_1OnCHHDrScrwd5y9rr5NPVgH",
    "publishable-key":
      "pk_test_51JuVCqDrScrwd5y9GZafwz2DRwbguDBXzQwLKYgs6pqNKJGoTUfPn3Isxiu9uQ30WQQlJ79c2182HQuevfiCZVBB00W23li65N",
  });
};
