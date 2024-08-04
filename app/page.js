'use client'
import Image from "next/image";
import { useState, useEffect } from "react";
import {firestore} from '@/firebase'
import { Box, Modal, Stack, TextField, Typography, Button, List } from "@mui/material";
import { collection, query, getDocs, doc, setDoc, getDoc, deleteDoc, updateDoc } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [open2, setOpen2] = useState(false)
  const [itemName, setItemName] = useState('')
  const [lquery, setLQuery] = useState('chicken orange')

  const APP_ID ='d9713b45'
  const APP_KEY = 'b2e947cc636d656d2a29673fc022f55e'
  const [recipes, setRecipes] = useState([])

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

  //recipes api function
  const getRecipes = async () => {
    const response = await fetch(`https://api.edamam.com/search?q=${lquery}&app_id=${APP_ID}&app_key=${APP_KEY}&from=0&to=20&calories=591-722&health=alcohol-free`);
    const data = await response.json();
    setRecipes(data.hits);

    for (const i of data.hits) {
      if (i.recipe) { // Check if i.recipe is defined
        console.log(i.recipe.label);
        console.log(i.recipe.calories);
        console.log(i.recipe.ingredients);
      } else {
        console.warn("Missing recipe data", i); // Log a warning for missing recipe data
      }
    }
  }

  useEffect(() => {
    updateInventory()
  },[])

  // This will update value whenever searchBarValue changes
  useEffect(() => {
    searchItem(searchBarValue)
  }, [searchBarValue]);

  //This will activate get recipes function once modal 2 opens 
  useEffect(() => {
    if (open2) {
      getRecipes();
    }
  }, [open2]);


  //modals
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleOpen2 = () => setOpen2(true)
  const handleClose2 = () => setOpen2(false)

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

      <Typography 
      variant="h4"
      
      >
        Your Pantry
      </Typography>

    <Box  display='flex'
          flexDirection='row'
          alignContent="flex-start"
          gap={30}>

      

<TextField
  sx={{
    width: '800px',
    height: '40px',
    backgroundColor: "#E6E6FA",
    '& .MuiOutlinedInput-root': {
      height: '100%', 
      '& fieldset': {
        border: 'none', 
      },
      '&:hover fieldset': {
        border: 'none', 
      },
      '&.Mui-focused fieldset': {
        border: 'none',
      },
    },
    '& .MuiInputBase-input': {
      height: '100%', 
      padding: '0 14px', 
    }, 
    '& .MuiInputBase-input::placeholder': {
      color: '#5D3FD3', // Change this to your desired color
      opacity: 1, // Ensures placeholder color is visible
    },
  }}
  placeholder="Search"
  value={searchBarValue}
  onChange={(e) => {
    setSearchBarValue(e.target.value);
  }}
/>

      



      <Button  onClick={() => {
        handleOpen()
        }}

        sx={{
          color: "#5D3FD3",
          backgroundColor: "white",
          border: '2px solid',
          borderColor: "#5D3FD3",
          '&:hover': { color: "white", bgcolor: '#5D3FD3' }
          
        }}
      > 
      Add New item
      </Button>

      </Box>

      <Box >
        <Box
        width='1200px'
        height='50px'
        sx={{ borderUp: 1, borderBottom: 1, borderColor: 'grey.500'}}
        display="flex"
        flexDirection="row"
        
        gap={63}>

          <Typography 
          variant="h5" 
          color="#333"
          textAlign="center"
            sx={{ marginLeft: "15px"}}>
           Item
          </Typography>

          <Typography 
          variant="h5" 
          color="#333"
          display='flex'>
            Quantity
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
            sx={{ flexBasis: '35.33%', textAlign: 'left' , color: '#5D3FD3'}}
            
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
              sx={{ 
                color: "#0096FF",
          backgroundColor: "white",
          border: '2px solid',
          borderColor: "#0096FF",
          '&:hover': { color: "white", bgcolor: '#0096FF' }
              }}
            >
              Add
            </Button>

            <Button 
              variant="contained"
              sx={{ 
                color: "red",
          backgroundColor: "white",
          border: '2px solid',
          borderColor: "red",
          '&:hover': { color: "white", bgcolor: 'red' }
              }}
              onClick={() => removeItem(name)}
            >
              Remove
            </Button>
          </Stack>
        </Box>
      ))}
    </Stack>

    
            <Button onClick={handleOpen2}
            sx={{
              color: "#32CD32",
              backgroundColor: "white",
              border: '2px solid',
              borderColor: "#32CD32",
              '&:hover': { color: "white", bgcolor: '#32CD32' }
              
            }}>
              Get Recipes
            </Button>

            <Modal
       open ={open2}
       onClose={handleClose2}
       
      >
        <Box
        position="absolute"
        top="50%"
        left="50%"
        width={900}
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
          <Typography variant="h6"> Recipes</Typography>
          <Stack width='1200px' height='300px' spacing={2} overflow='auto'>
            
           {recipes.map((recipe, index) => (
            <Box>
               <Typography variant="h6">{recipe.recipe.label}</Typography>
               <Typography variant="body2">Calories: {recipe.recipe.calories}</Typography>
               <img src={`${recipe.recipe.img}`}
               sx={{ width: 500, height: 450 }}/>
              <Typography variant="h5">Ingredients: </Typography>
               <List>
               {recipe.recipe.ingredients.map(ingredient => (
                    <Typography> - {ingredient.text}</Typography>
                ))}
               </List>
            </Box>
           ))}
            
            
          </Stack>
        </Box>

      </Modal>
      </Box>
    </Box>
    
  );
}
