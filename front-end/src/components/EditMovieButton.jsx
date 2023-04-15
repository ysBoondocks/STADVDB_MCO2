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

export default function EditMovieButton({index, table, node}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen((cur) => !cur);

  const [inputValues, setInputValues] = useState({
    name: table[index].name,
    year: table[index].year,
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
    if (node===1){
      Axios.post('http://localhost:80/api/edit', {
        id: table[index].id,
        name: inputValues.name,
        year: inputValues.year,
      }).then((response) => {
        if(response){
          window.location.reload();
        }
      });
    } else if (node===2){
      Axios.post('http://localhost:80/api/edit2', {
        id: table[index].id,
        name: inputValues.name,
        year: inputValues.year,
      }).then((response) => {
        if(response){
          window.location.reload();
        }
      });
    } else if (node===3){
      Axios.post('http://localhost:80/api/edit3', {
        id: table[index].id,
        name: inputValues.name,
        year: inputValues.year,
      }).then((response) => {
        if(response){
          window.location.reload();
        }
      });
    }
  };

  return (
    <React.Fragment>
      <Button onClick={handleOpen} className="bg-green-500">
        Edit Movie
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
            <Typography variant="h3" color="white" className='text-center'>
              Editting
            </Typography>
            <Typography variant="p" color="white" className='text-center'>
              {table[index].name}
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
              Confirm Changes
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
