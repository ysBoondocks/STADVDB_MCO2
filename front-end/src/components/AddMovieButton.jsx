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

export default function AddMovieButton() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen((cur) => !cur);

  const [inputValues, setInputValues] = useState({
    name: "",
    year: "",
    genre: "",
    d_fname: "",
    d_lname: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
              <Input
                label="Genre"
                size="md"
                name="genre"
                value={inputValues.genre}
                onChange={handleInputChange}
              />

              <div className="h-2"></div>

              <Input
                label="Director's First Name"
                size="md"
                name="d_fname"
                value={inputValues.d_fname}
                onChange={handleInputChange}
              />
              <Input
                label="Director's Last Name"
                size="md"
                name="d_lname"
                value={inputValues.d_lname}
                onChange={handleInputChange}
              />
            </form>
          </CardBody>
          <CardFooter className="pt-5 flex justify-evenly items-center">
            <Button onClick={handleSubmit} className="w-3/5 bg-indigo-500">
              Add Movie
            </Button>
            <Button onClick={handleOpen} className="bg-red-400">
              Cancel
            </Button>
          </CardFooter>
        </Card>
      </Dialog>
    </React.Fragment>
  );
}
