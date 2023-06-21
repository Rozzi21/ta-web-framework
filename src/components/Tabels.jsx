import {
  Avatar,
  Button,
  Card,
  Dialog,
  List,
  ListItem,
  ListItemPrefix,
  Typography
} from "@material-tailwind/react";
import React from "react";
import face1 from "../images/avatar1.jpg";
import { gql, useQuery } from "@apollo/client";
import { useMutation } from "@apollo/client";
import { Textfield } from "material";

const images = [face1,];

function getRandomImageIndex() {
  return Math.floor(Math.random() * images.length);
}

const GET_UTANGS = gql`
  mutation UpdateUtang($id: ID!, $jumlah_pinjam: Int!) {
    updateUtang(id: $id, jumlah_pinjam: $jumlah_pinjam) {
      id
      nama
      jumlah_pinjam
      tanggal_pinjam
      tanggal_kembali
    }
  }
`;

const DELETE_PINJAMAN = gql`
  mutation DeletePinjaman($id: Int!) {
    delete_tabel_utang(where: { id: { _eq: $id } }) {
      affected_rows
    }
  }
`;

const EDIT_PINJAMAN = gql`
mutation UpdateUtang($id: ID!, $jumlah_pinjam: Int!) {
  updateUtang(id: $id, jumlah_pinjam: $jumlah_pinjam) {
    id
    nama
    jumlah_pinjam
    tanggal_pinjam
    tanggal_kembali
  }
} `

const Tabels = () => {
  const randomIndex = getRandomImageIndex();

  const { loading, error, data } = useQuery(GET_UTANGS);

  const [updateUtang] = useMutation(EDIT_PINJAMAN);


  const [deletePinjaman, { loading: deleteLoading,}] =
  useMutation(DELETE_PINJAMAN, {
    refetchQueries: [{ query: GET_UTANGS }],
  });

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleEdit = (id) => {
    const selectedUtang = data.tabel_utang.find((utang) => utang.id === id);
    setEditData(selectedUtang);
    setOpenDialog(true);
  };

  const handleSave = () => {
    // Perform the mutation to update the data
    updateUtang({
      variables: {
        id: editData.id,
        jumlah_pinjam: parseInt(editData.jumlah_pinjam),
      },
    })
      .then((result) => {
        console.log("Data updated successfully:", result);
        // Close the dialog and reset the editData state
        setOpenDialog(false);
        setEditData(null);
      })
      .catch((error) => {
        console.error("Error updating data:", error);
      });
  };


  const handleDelete = (id) => {
    deletePinjaman({
      variables: {
        id: id,
      },
    })
      .then((result) => {
        // Handle success
        console.log(result);
      })
      .catch((error) => {
        // Handle error
        console.error(error);
      });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="w-full flex justify-center">
        <div className="w-full flex justify-center">
          <Card className="w-1/4">
            <List>
              {data.tabel_utang.map((utang) => (
                <ListItem key={utang.id} className=" border border-solid border-gray-400 rounded-lg mb-4 p-6 flex justify-center">
                  <ListItemPrefix>
                    <Avatar className="w-40" variant="circular" alt="candice" src={images[randomIndex]} />
                  </ListItemPrefix>
                  <div className="w-96">
                    <Typography variant="h6" color="blue-gray">
                      {utang.nama}
                    </Typography>
                    <Typography variant="small" color="gray" className="font-normal">
                      Jumlah Pinjam: {utang.jumlah_pinjam}
                    </Typography>
                    <Typography variant="small" color="gray" className="font-normal">
                      Tanggal Pinjam: {utang.tanggal_pinjam}
                    </Typography>
                    <Typography variant="small" color="gray" className="font-normal">
                      Tanggal Kembali: {utang.tanggal_kembali}
                    </Typography>
                  </div>
                  <div className="w-24 ml-4 mb-6">
                  <Button
                    className="mt-6 mb-4"
                    fullWidth
                    onClick={() => handleDelete(utang.id)}
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? "Deleting..." : "Hapus"}
                  </Button>
                  {/* <Link to={`/edit/${utang.id}`} className="mt-6"> */}
                    <Button fullWidth disabled={loading}                     onClick={() => handleEdit(utang.id)}>
                      {loading ? "Loading..." : "Edit"}
                    </Button>
                  {/* </Link> */}
                  </div>
                </ListItem>
              ))}
            </List>
          </Card>
        </div>
        <Dialog open={openDialog} onClose={handleDialogClose}>
    <DialogTitle>Edit Utang</DialogTitle>
    <DialogContent>
      {editData && (
        <form>
          <TextField
            label="Nama"
            value={editData.nama}
            onChange={(e) => setEditData({ ...editData, nama: e.target.value })}
            fullWidth
          />
          <Textfield
            label="Jumlah Pinjam"
            value={editData.jumlah_pinjam}
            onChange={(e) => setEditData({ ...editData, jumlah_pinjam: e.target.value })}
            fullWidth
          />
          {/* Add more fields as needed */}
        </form>
      )}
    </DialogContent>
    <DialogActions>
      <Button onClick={handleDialogClose} color="primary">
        Cancel
      </Button>
      <Button onClick={handleSave} color="primary">
        Save
      </Button>
    </DialogActions>
  </Dialog>
      </div>
      
  );
};

export default Tabels;
