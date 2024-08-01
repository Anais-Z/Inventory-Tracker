'use client'
import Image from "next/image";
import { useState, useEffect } from "react";
import {firestore} from '@/firebase'
import { Box, Modal, Stack, TextField, Typography, Button } from "@mui/material";
import { collection, query, getDocs, doc, setDoc, getDoc, deleteDoc, updateDoc } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')

  //this is use to represent the complete inventory (mainly used for search bar)
  const [completeInventory, setCompleteInventory] = useState([])

  //this represent the value in the search bar
  const [searchBarValue, setSearchBarValue] = useState("")

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
    setCompleteInventory(inventoryList)
 
  }

  //add item function
  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()){
       const {quantity} = docSnap.data()
      await setDoc(docRef, {quantity: quantity + 1})
    }
    else{
      await setDoc(docRef, {quantity: 1})
    }

    await updateInventory()
  }

  //remove item function
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    console.log('check')

    if(docSnap.exists()){
       const {quantity} = docSnap.data()
       console.log(`${item} checks`)
       if(quantity == 1){
        await deleteDoc(docRef)
       }
       else{
        await setDoc(docRef, {quantity: quantity - 1})
      
      }
    }
   

    await updateInventory()
  }

  //search item function
  const searchItem = (searchBarValue) => {

    if(searchBarValue == "")
      {
        setInventory(completeInventory)
      }
      else{
       
        //search through every object in list
        const filtered = completeInventory.filter( (item) => item.name.toLowerCase().includes(searchBarValue.toLowerCase()) )
        //if the name contains anything from the search bar value, add it to the setInventory
  
        setInventory(filtered)
      }
  }

  useEffect(() => {
    updateInventory()
  },[])

  // This will update value whenever searchBarValue changes
  useEffect(() => {
    searchItem(searchBarValue)
  }, [searchBarValue]);


  //modals
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Box width="100vw" 
         height='100vh' 
         display='flex' 
         justifyContent='center' 
         flexDirection='column'
         alignItems='center' 
         gap={2}
    >

      <Modal
       open ={open}
       onClose={handleClose}
      >
        <Box
        position="absolute"
        top="50%"
        left="50%"
        width={400}
        bgcolor='white'
        border="2px solid #0001"
        boxShadow={24}
        p={4}
        display='flex'
        flexDirection='column'
        gap={3}
        sx={{
          transform: "translate(-50%,-50%)"
        }}
        >
          <Typography variant="h6"> Add items</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
            variant='outlined'
            fullWidth
            value={itemName}
            onChange={(e) =>{
              setItemName(e.target.value)
            }}
            />
            <Button variant='outlined' onClick={() => {
              addItem(itemName)
              setItemName('')
              handleClose()
            }}> Add </Button>
          </Stack>
        </Box>

      </Modal>

    <Box  display='flex'
          flexDirection='row'
          gap={30}>

      <Box 
           
        >

        <TextField 
            variant='outlined'
            sx={{ width: '500px', height: '60px',
              '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'purple', // Default border color
            },
            '&:hover fieldset': {
              borderColor: 'purple', // Hover border color
            },
            '&.Mui-focused fieldset': {
              borderColor: 'purple', // Focused border color
            },
          },
             }}
            
            value={searchBarValue}
            onChange={(e) =>{
              setSearchBarValue(e.target.value)
            }}/>

      </Box>



      <Button variant="outlined" onClick={() => {
        handleOpen()
        }}
      > 
      Add New item
      </Button>

      </Box>

      <Box >
        <Box
        width='1200px'
        height='100px'
        bgcolor='#ADD8E6'>

          <Typography 
          variant="h2" 
          color="#333"
          display='flex'
          justifyContent='Your Pantry'
          alignItems='center'>
            Your Pantry
          </Typography>
        </Box>

      

        <Stack width='1200px' height='300px' spacing={2} overflow='auto'>
      {inventory.map(({ name, quantity }) => (
        <Box 
          key={name} 
          width="100%" 
          minHeight="100px" 
          display="flex"
          alignItems="center" 
          justifyContent="space-between" 
          sx={{ borderUp: 1, borderBottom: 1, borderColor: 'grey.500'}}
          padding={2}
        >
          <Typography 
            variant='h5' 
            color='#333' 
            textAlign="center"
            sx={{ flexBasis: '33.33%', textAlign: 'left' }}
          >
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </Typography>

          <Typography 
            variant='h5' 
            color='#333' 
            textAlign="center"
            sx={{ flexBasis: '33.33%', textAlign: 'center' }}
          >
            {quantity}
          </Typography>

          <Stack 
            direction="row" 
            spacing={10} 
            alignItems="center"
            sx={{ flexBasis: '33.33%', justifyContent: 'flex-end' }}
          >
            <Button 
              variant="contained"
              onClick={() => addItem(name)}
            >
              Add
            </Button>

            <Button 
              variant="contained"
              sx={{ bgcolor: 'red', '&:hover': { bgcolor: 'darkred' } }}
              onClick={() => removeItem(name)}
            >
              Remove
            </Button>
          </Stack>
        </Box>
      ))}
    </Stack>
    
      </Box>
    </Box>
    
  );
}
