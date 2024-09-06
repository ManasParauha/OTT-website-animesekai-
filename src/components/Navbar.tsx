import React from 'react'
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import TvIcon from '@mui/icons-material/Tv';
import MovieCreationIcon from '@mui/icons-material/MovieCreation';
import Link from 'next/link';
import AddCircleIcon from '@mui/icons-material/AddCircle';
const Navbar = () => {
  return (
    <nav className='fixed md:hidden bottom-0 left-0 w-full h-20 bg-background flex justify-around items-center z-10'>

       <Link href="/"> <HomeIcon/></Link>

        <Link href="/search"><SearchIcon/></Link>

        <Link href="/Hub"><AddCircleIcon/></Link>

        <Link href="/Series"><TvIcon/></Link>

        <Link href="/Movies"><MovieCreationIcon/></Link>
    </nav>
  )
}

export default Navbar
