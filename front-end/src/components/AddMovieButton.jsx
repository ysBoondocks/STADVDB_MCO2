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

export default function AddMovieButton() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen((cur) => !cur);

  const [inputValues, setInputValues] = useState({
    name: "",
    year: "",
  });

  const handleCancel = () => {
    let temp = {
      name: "",
      year: "",
    }
    setInputValues(temp)
    handleOpen()
  }
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    Axios.post('http://localhost:80/api/add', {
      name: inputValues.name,
      year: inputValues.year,
    }).then((response) => {
      if(response){
        
        let temp = {
          name: "",
          year: "",
        }
        setInputValues(temp)
        handleOpen()
        console.log(inputValues);
        window.location.reload();
      }
    });

 
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
        </Card>
      </Dialog>
    </React.Fragment>
  );
}
