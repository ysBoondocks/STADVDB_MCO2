import React, { useState } from "react";
import { Checkbox } from "@material-tailwind/react";

export default function Table({
  table,
  handleCheckbox,
  isChecked,
  setIsChecked,
}) {
  const [show, setShow] = useState(null);

  const [currChecked, setCurrChecked] = useState(-1);
  const [colNames, setColNames] = useState(["ID", "Name", "Year"]);

  // const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (event, index) => {
    setIsChecked(event.target.checked);
    handleCheckbox(event.target.checked, index);
    setCurrChecked(index);
    console.log(index);
  };

  return (
    <div className="mt-7 overflow-y-auto">
      {/* TABLE */}

      {table.length === 0 ? (
        <>
          <div className="text-center font-bold w-full">No Records Found</div>
        </>
      ) : (
        <>
          <div class="flex flex-col overflow-y-auto" style={{ overflowX: "hidden" }}>
            <div class="sm:-mx-6 lg:-mx-8">
              <div class="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                <div class="h-96 overflow-y-auto">
                  <table class="table-auto min-w-full text-left text-sm font-light">
                    <thead class="border-b font-bold dark:border-neutral-500 bg-indigo-700 text-white sticky top-0">
                      <tr>
                        <th scope="col" class="px-6 py-4"></th>
                        {colNames.map((col, index) => {
                          return (
                            <th scope="col" class="px-6 py-4" key={index}>
                              {col}
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {}
                      {table.map((row, index) => {
                        if(row.flag){
                          return (<></>)
                        }
                        else{
                          return (
                            <tr
                              class="border-b dark:border-neutral-500"
                              key={index}
                            >
                              <td class="whitespace-nowrap px-6 py-4 font-medium">
                                {/* CHECKBOX FOR EDIT AND DELETE */}
                                {index === currChecked && isChecked ? (
                                  <Checkbox
                                    checked={true}
                                    onChange={(event) =>
                                      handleCheckboxChange(event, index)
                                    }
                                  />
                                ) : (
                                  <Checkbox
                                    checked={false}
                                    onChange={(event) =>
                                      handleCheckboxChange(event, index)
                                    }
                                  />
                                )}
                              </td>
                              <td class="whitespace-nowrap px-6 py-4 font-medium">
                                {row.id}
                              </td>
                              <td class="whitespace-nowrap px-6 py-4 font-medium">
                                {row.name}
                              </td>
                              <td class="whitespace-nowrap px-6 py-4 font-medium">
                                {row.year}
                              </td>
                              {/* <td class="whitespace-nowrap px-6 py-4">
                                    Cell
                                  </td>
                                  <td class="whitespace-nowrap px-6 py-4">
                                    Cell
                                  </td> */}
                            </tr>
                          );
                        }
                        
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="text-gray-700 mt-4 ml-0">Showing {table.length} records</div>
          </div>
        </>
      )}

      {/* END TABLE */}
    </div>
  );
}
