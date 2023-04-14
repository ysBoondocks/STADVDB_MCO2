import React, { useState, useEffect } from "react";
import Table from "../components/Table";
import AddMovieButton from "../components/AddMovieButton";
import Header from "../components/Header";
import Search from "../components/Search";
import DeleteMovieButton from "../components/DeleteMovieButton";

import Axios from "axios";
import EditMovieButton from "../components/EditMovieButton";

export default function Home() {
  const [node, setNode] = useState(1);
  const [tableToShow, setTableToShow] = useState([{}]);

  const handleSetNode = (node) => {
    setNode(node);
    console.log(node);
    setIsChecked(false);
  };

  const [isChecked, setIsChecked] = useState(false);
  const [index, setIndex] = useState(-1);

  function handleCheckbox(val, index) {
    setIsChecked(val);
    setIndex(index);
  }

  const [rows1, setRows1] = useState([
    {
      id: 1,
      name: "Avengers",
      year: "2012",
      genre: "Action",
      director_first_name: "Jorge",
      director_last_name: "Bush",
    },
  ]);

  const [rows2, setRows2] = useState([
    {
      id: 1,
      name: "Band",
      year: "1934",
      genre: "Horror",
      director_first_name: "Name",
      director_last_name: "Less",
    },
  ]);

  const [rows3, setRows3] = useState([
    {
      id: 1,
      name: "Revengers",
      year: "2233",
      genre: "Comde",
      director_first_name: "Jorge",
      director_last_name: "Bush",
    },
    {
      id: 2,
      name: "Revengers",
      year: "2233",
      genre: "Comde",
      director_first_name: "Jorge",
      director_last_name: "Bush",
    },
    {
      id: 3,
      name: "Revengers",
      year: "2233",
      genre: "Comde",
      director_first_name: "Jorge",
      director_last_name: "Bush",
    },
  ]);

  useEffect(() => {
    if (node === 1) {
      setTableToShow(rows1);
    } else if (node === 2) {
      setTableToShow(rows2);
    } else {
      setTableToShow(rows3);
    }
  }, [node, rows1, rows2, rows3]);

  useEffect(() => {
    Axios.get("http://localhost:80/api/get").then((response) => {
      console.log(response.data);
      setRows1(response.data);
    });
  }, []);

  console.log(rows1);
  return (
    <div>
      <div className="sm:px-6 w-full">
        {/* SORTING */}
        <div className="px-4 py-2">
          <div>
            <Header></Header>
          </div>
          <div className="flex items-center justify-center">
            <Search></Search>
          </div>
        </div>
        {/* END OF SORTING */}
        <div className="bg-white py-4 md:py-7 px-4 md:px-8 xl:px-10">
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

          <Table table={tableToShow} handleCheckbox={handleCheckbox} isChecked={isChecked} setIsChecked={setIsChecked}></Table>
        </div>
      </div>
    </div>
    // <Table></Table>
  );
}
