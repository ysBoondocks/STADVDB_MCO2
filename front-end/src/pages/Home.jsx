import React, { useState, useEffect } from "react";
import Table from "../components/Table";
import AddMovieButton from "../components/AddMovieButton";
import Header from "../components/Header";
import Search from "../components/Search";
import DeleteMovieButton from "../components/DeleteMovieButton";

export default function Home() {
  const [node, setNode] = useState(1);
  const [tableToShow, setTableToShow] = useState([{},]);

  const handleSetNode = (node) => {
    setNode(node);
    console.log(node);
  };

  const [isChecked, setIsChecked] = useState(false);
  const [index, setIndex] = useState(-1);

  function handleCheckbox(val,index){
    setIsChecked(val);
    setIndex(index)
  }

  
  const [rows1, setRows1] = useState([
    {
      ID: 1,
      Name: "Avengers",
      Year: "2012",
      Genre: "Action",
      D_fname: "Jorge",
      D_lname: "Bush",
    },
    {
      ID: 2,
      Name: "Revenge",
      Year: "1999",
      Genre: "Comedy",
      D_fname: "Georgia",
      D_lname: "Tree",
    },
  ]);

  const [rows2, setRows2] = useState([
    {
      ID: 1,
      Name: "Band",
      Year: "1934",
      Genre: "Horror",
      D_fname: "Name",
      D_lname: "Less",
    },
  ]);

  const [rows3, setRows3] = useState([
    {
      ID: 1,
      Name: "Avengers",
      Year: "2012",
      Genre: "Action",
      D_fname: "Jorge",
      D_lname: "Bush",
    },
    {
      ID: 2,
      Name: "Revenge",
      Year: "1999",
      Genre: "Comedy",
      D_fname: "Georgia",
      D_lname: "Tree",
    },
    {
        ID: 3,
        Name: "Ojt",
        Year: "2200",
        Genre: "Drama",
        D_fname: "He",
        D_lname: "She",
      },
  ]);

  useEffect(()=>{
    if(node === 1){
      setTableToShow(rows1);
    }else if(node === 2){
      setTableToShow(rows2);
    }else{
      setTableToShow(rows3);
    }
  },[node, rows1, rows2, rows3])

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
            {/* <div className="py-3 px-4 flex items-center text-sm font-medium leading-none text-gray-600 bg-gray-200 hover:bg-gray-300 cursor-pointer rounded">
              <p>Sort By:</p>
              <select className="focus:outline-none bg-transparent ml-1">
                <option className="text-sm text-indigo-800">Latest</option>
                <option className="text-sm text-indigo-800">Oldest</option>
                <option className="text-sm text-indigo-800">Latest</option>
              </select>
            </div> */}
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

            {/* <button
              onclick="popuphandler(true)"
              className="mt-4 sm:mt-0 inline-flex items-start justify-start px-6 py-3 bg-indigo-700 hover:bg-indigo-600 focus:outline-none rounded"
            >
              <p className="text-sm font-medium leading-none text-white">
                Add Movie
              </p>
            </button> */}
            {isChecked ? (<><DeleteMovieButton index={index}></DeleteMovieButton></>): (<><AddMovieButton className="bg-indigo-500"></AddMovieButton></>)
            }
            
          </div>
          {/* END OF NODE TABS */}

          <Table table={tableToShow} handleCheckbox={handleCheckbox}></Table>
        </div>
      </div>
    </div>
    // <Table></Table>
  );
}
