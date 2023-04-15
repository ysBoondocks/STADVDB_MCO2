import React, { useState } from "react";
import {
  Button,
  Dialog,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
} from "@material-tailwind/react";
import Axios from "axios";

export default function AddMovieButton({ node, table }) {
  const [open, setOpen] = React.useState(false);
  const [existing, setExisting] = React.useState(false);
  const handleOpen = () => setOpen((cur) => !cur);

  const [inputValues, setInputValues] = useState({
    name: "",
    year: "",
  });

  const showError = () => {};

  const handleCancel = () => {
    let temp = {
      name: "",
      year: "",
    };
    setInputValues(temp);
    handleOpen();
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    table.forEach(function (row, index) {
      if (row.name === inputValues.name) {
        setExisting(true);
      } else if (row.year === inputValues.year) {
        setExisting(true);
      } else {
        setExisting(false);
      }
    });

    if (!existing) {
      if (node === 1) {
        Axios.post("http://localhost:80/api/add", {
          name: inputValues.name,
          year: inputValues.year,
        }).then((response) => {
          if (response) {
            window.location.reload();
          } else {
            //DISPLAY MOVIE EXISTS
          }
        });
      } else if (node === 2) {
        Axios.post("http://localhost:80/api/add2", {
          name: inputValues.name,
          year: inputValues.year,
        }).then((response) => {
          if (response) {
            window.location.reload();
          } else {
            //DISPLAY MOVIE EXISTS
          }
        });
      } else if (node === 3) {
        Axios.post("http://localhost:80/api/add3", {
          name: inputValues.name,
          year: inputValues.year,
        }).then((response) => {
          if (response) {
            window.location.reload();
          } else {
            //DISPLAY MOVIE EXISTS
          }
        });
      }
    } else {
      setExisting(true)
    }
    console.log(inputValues);
  };

  return (
    <React.Fragment>
      <Button onClick={handleOpen} className="bg-indigo-500">
        Add Movie
      </Button>
      <Dialog
        size="xs"
        open={open}
        handler={handleOpen}
        className="bg-transparent shadow-none"
      >
        <Card className="mx-auto w-full max-w-[24rem]">
          {existing ? (
            <>
              <CardBody>
                <Typography variant="h8" color="black" className="text-center">
                  There is already an existing movie with that name/year
                </Typography>
              </CardBody>
              <CardFooter className="pt-0 flex justify-evenly items-center">
                <Button
                  onClick={() => {
                    setExisting(!existing);
                  }}
                  className="w-3/5 bg-red-400"
                >
                  OK
                </Button>
              </CardFooter>
            </>
          ) : (
            <>
              {" "}
              <CardHeader
                color="blue"
                className="mb-4 grid h-28 place-items-center bg-indigo-500"
              >
                <Typography variant="h3" color="white">
                  Adding Movie
                </Typography>
              </CardHeader>
              <CardBody>
                <form className="flex flex-col gap-4">
                  <Input
                    label="Movie Name"
                    size="md"
                    name="name"
                    value={inputValues.name}
                    onChange={handleInputChange}
                  />
                  <Input
                    label="Year"
                    size="md"
                    name="year"
                    value={inputValues.year}
                    onChange={handleInputChange}
                  />
                </form>
              </CardBody>
              <CardFooter className="pt-5 flex justify-evenly items-center">
                <Button onClick={handleSubmit} className="w-3/5 bg-indigo-500">
                  Add Movie
                </Button>
                <Button onClick={handleCancel} className="bg-red-400">
                  Cancel
                </Button>
              </CardFooter>
            </>
          )}
        </Card>
      </Dialog>
    </React.Fragment>
  );
}
