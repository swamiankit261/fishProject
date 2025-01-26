// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/frontend_assets/assets";
import { useLocation } from "react-router-dom";
import { useFetchProductsQuery } from "../redux/api/product";
import { useDispatch } from "react-redux";
import { setProducts } from "../redux/features/product/productSlice";

const SearchBar = (props) => {
  const { showSearch, setShowSearch } = props || true;
  const [visible, setVisible] = useState(false)
  const [search, setSearch] = useState("");
  const location = useLocation();

  const dispatch = useDispatch();

  // Add query parameters dynamically
  const queryParams = new URLSearchParams();
  if (search) queryParams.append("search", search);

  // Fetch products based on query params
  const { data } = useFetchProductsQuery(queryParams.toString());

  // Dispatch fetched products to Redux store
  useEffect(() => {
    if (data) {
      dispatch(setProducts(data));
    }
  }, [data, dispatch]);

  // Toggle visibility based on route
  useEffect(() => {
    if (location.pathname.includes("collection")) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [location]);

  return visible && showSearch ? (
    <div>
      <div className="border-t border-b bg-gray-50 text-center">
        <div className="inline-flex items-center justify-center border border-gray-400 px-5 py-5 my-5 mx-3 rounded-full w-3/4 sm:w-1/2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 outline-none bg-inherit text-sm"
            type="text"
            placeholder="Search by fish name, category or price"
          />
          <img src={assets.search_icon} className="w-4" alt="Search" />
        </div>
        <img
          src={assets.cross_icon}
          className="inline w-3 cursor-pointer"
          onClick={() => setShowSearch(false)}
          alt="Close"
        />
      </div>
    </div>
  ) : null;
};

export default SearchBar;
