import React, { useState, useEffect } from "react";
import Table from "../components/Table";
import AddMovieButton from "../components/AddMovieButton";
import Header from "../components/Header";
import Search from "../components/Search";
import DeleteMovieButton from "../components/DeleteMovieButton";

import axios from "axios";
import EditMovieButton from "../components/EditMovieButton";
import Loading from "../components/Loading";

export default function Home() {
  const [node, setNode] = useState(1);
  const [tableToShow, setTableToShow] = useState([{}]);

  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [nodeStatus, setNodeStatus] = useState({
    node1: true,
    node2: true,
    node3: false,
  });

  const [search, setSearch] = useState("");

  const [rows1, setRows1] = useState([]);

  const [rows2, setRows2] = useState([]);

  const [rows3, setRows3] = useState([]);

  const handleSearch = (inputSearch) => {
    setSearch(inputSearch);
  };

  useEffect(() => {
    async function searchData() {
      const response = await axios.get(
        `http://localhost:80/api/search/${search}`
      );
      console.log(response);

      if (node === 1) {
        setRows1(response.data);
      } else if (node === 2) {
        setRows2(response.data);
      } else {
        setRows3(response.data);
      }
    }

    if (search !== "") {
      searchData();
    }
    console.log("useEffect");
  }, [search]);

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get("http://localhost:80/api/get");
      setData(response);
      setRows1(response.data);
      setLoading(false);
    }

    async function fetchData2() {
      const response = await axios.get("http://localhost:80/api/get2");
      setData(response);
      setRows2(response.data);
      setLoading(false);
    }

    async function fetchData3() {
      const response = await axios.get("http://localhost:80/api/get3");
      setData(response);
      setRows3(response.data);
      setLoading(false);
    }

    if (search === "") {
      fetchData();
      fetchData2();
      fetchData3();
    }
  }, [search]);

  const handleSetNode = (node) => {
    setNode(node);
    setIsChecked(false);
  };

  const [isChecked, setIsChecked] = useState(false);
  const [index, setIndex] = useState(-1);

  function handleCheckbox(val, index) {
    setIsChecked(val);
    setIndex(index);
  }

  useEffect(() => {
    if (node === 1) {
      setTableToShow(rows1);
    } else if (node === 2) {
      setTableToShow(rows2);
    } else {
      setTableToShow(rows3);
    }
  }, [node, rows1, rows2, rows3]);

  return (
    <div>
      {loading ? (
        <Loading></Loading>
      ) : (
        <div className="sm:px-6 w-full">
          {/* SORTING */}
          <div className="px-4 py-2">
            <div>
              <Header></Header>
            </div>
            <div className="flex items-center justify-center">
              <Search handleSearch={handleSearch}></Search>
            </div>
            <div className="flex justify-evenly w-48 ml-10">
              {nodeStatus.node1 ? (
                <>
                  {" "}
                  <span class="inline-block whitespace-nowrap rounded-[0.27rem] bg-green-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-green-700">
                    Node1
                  </span>
                </>
              ) : (
                <>
                  {" "}
                  <span class="inline-block whitespace-nowrap rounded-[0.27rem] bg-red-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-red-700">
                    Node1
                  </span>
                </>
              )}
              {nodeStatus.node2 ? (
                <>
                  {" "}
                  <span class="inline-block whitespace-nowrap rounded-[0.27rem] bg-green-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-green-700">
                    Node2
                  </span>
                </>
              ) : (
                <>
                  {" "}
                  <span class="inline-block whitespace-nowrap rounded-[0.27rem] bg-red-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-red-700">
                    Node2
                  </span>
                </>
              )}
              {nodeStatus.node3 ? (
                <>
                  {" "}
                  <span class="inline-block whitespace-nowrap rounded-[0.27rem] bg-green-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-green-700">
                    Node3
                  </span>
                </>
              ) : (
                <>
                  {" "}
                  <span class="inline-block whitespace-nowrap rounded-[0.27rem] bg-red-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-red-700">
                    Node3
                  </span>
                </>
              )}
            </div>
          </div>
          {/* END OF SORTING */}
          <div className="bg-white py-2 md:py-7 px-4 md:px-8 xl:px-10">
            {/* NODE TABS */}
            <div className="sm:flex items-center justify-between">
              <div className="flex items-center">
                {node === 1 ? (
                  <div onClick={() => handleSetNode(1)}>
                    <div className="py-2 px-8 bg-indigo-500 text-white rounded-full font-bold cursor">
                      <p>Node 1</p>
                    </div>
                  </div>
                ) : (
                  <div onClick={() => handleSetNode(1)}>
                    <div className="py-2 px-8 text-gray-600 hover:text-indigo-500 hover:bg-indigo-100 rounded-full cursor font-bold transition-colors duration-200">
                      <p>Node 1</p>
                    </div>
                  </div>
                )}
                {node === 2 ? (
                  <div onClick={() => handleSetNode(2)}>
                    <div className="py-2 px-8 bg-indigo-500 text-white rounded-full font-bold cursor">
                      <p>Node 2</p>
                    </div>
                  </div>
                ) : (
                  <div onClick={() => handleSetNode(2)}>
                    <div className="py-2 px-8 text-gray-600 hover:text-indigo-500 hover:bg-indigo-100 rounded-full cursor font-bold transition-colors duration-200">
                      <p>Node 2</p>
                    </div>
                  </div>
                )}

                {node === 3 ? (
                  <div onClick={() => handleSetNode(3)}>
                    <div className="py-2 px-8 bg-indigo-500 text-white rounded-full font-bold cursor">
                      <p>Node 3</p>
                    </div>
                  </div>
                ) : (
                  <div onClick={() => handleSetNode(3)}>
                    <div className="py-2 px-8 text-gray-600 hover:text-indigo-500 hover:bg-indigo-100 rounded-full cursor font-bold transition-colors duration-200">
                      <p>Node 3</p>
                    </div>
                  </div>
                )}
              </div>

              {isChecked ? (
                <div className="flex justify-between w-72">
                  <EditMovieButton
                    index={index}
                    table={tableToShow}
                  ></EditMovieButton>
                  <DeleteMovieButton
                    index={index}
                    table={tableToShow}
                  ></DeleteMovieButton>
                </div>
              ) : (
                <>
                  <AddMovieButton className="bg-indigo-500"></AddMovieButton>
                </>
              )}
            </div>
            {/* END OF NODE TABS */}

            <Table
              table={tableToShow}
              handleCheckbox={handleCheckbox}
              isChecked={isChecked}
              setIsChecked={setIsChecked}
            ></Table>
          </div>
        </div>
      )}
    </div>
    // <Table></Table>
  );
}
