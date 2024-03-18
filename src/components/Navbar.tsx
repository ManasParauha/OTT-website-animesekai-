import React from 'react'
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import TvIcon from '@mui/icons-material/Tv';
import MovieCreationIcon from '@mui/icons-material/MovieCreation';
const Navbar = () => {
  return (
    <nav className='fixed md:hidden bottom-0 left-0 w-full h-20 bg-background flex justify-around items-center'>
        <HomeIcon/>
        <SearchIcon/>
        <TvIcon/>
        <MovieCreationIcon/>
    </nav>
  )
}

export default Navbar
