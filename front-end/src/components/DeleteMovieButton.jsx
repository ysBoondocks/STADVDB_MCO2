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

export default function DeleteMovieButton({index, table}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen((cur) => !cur);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(index);
    Axios.post('http://localhost:80/api/delete', {
      id: table[index].id,
      year: table[index].year,
    }).then((response) => {
      if(response){
        window.location.reload();
      }
    });
  };

  return (
    <React.Fragment>
      <Button onClick={handleOpen} className="bg-red-400">
        Delete Movie
      </Button>
      <Dialog
        size="s"
        open={open}
        handler={handleOpen}
        className="bg-transparent shadow-none"
      >
        <Card className="mx-auto w-full max-w-[24rem]">
          <CardBody>
            <Typography variant="p" color="black" className='text-center'>
                Are you sure you want to delete this movie?
            </Typography>
            <Typography variant="h4" color="black" className='text-center'>
                {table[index].name}
            </Typography>
          </CardBody>
          <CardFooter className="pt-0 flex justify-evenly items-center">
            <Button onClick={handleSubmit} className=" bg-green-500">
              Confirm
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
