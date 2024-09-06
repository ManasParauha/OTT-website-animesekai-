"use client"
import React from 'react'

import SearchBar from '@/components/SearchBar';
import SearchResult from '@/components/SearchResult';
import NavbarMD from '@/components/NavbarMD';
import LogoUser from '@/components/LogoUser';
import Navbar from '@/components/Navbar';

const page = (
  {searchParams,}:{
    searchParams?:{
      query?:string;
    }
  }
) => {

  const query = searchParams?.query || '' ;
  console.log("query",query)

  return (
    <div className='flex w-full'>

       {/* <div className="fixed hidden md:block left-0 top-0 z-10"><NavbarMD /></div> */}

      <div className='md:ml-24'>

        {/* <LogoUser/> */}

      <SearchBar/>
      <SearchResult query={query}/>
      <div className=' h-24'></div>

      {/* <Navbar/> */}
      
      </div>
      
    </div>
  )
}

export default page
