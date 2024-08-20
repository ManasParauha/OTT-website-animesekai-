"use client"
import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import SearchIcon from '@mui/icons-material/Search';
import { useSearchParams,usePathname,useRouter } from 'next/navigation';

const SearchBar = () => {

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = (searchTerm : string) =>{
    const params = new URLSearchParams(searchParams);
    if(searchTerm){
      params.set("query",searchTerm);
    }else{
      params.delete("query")
    }

    replace(`${pathname}?${params.toString()}`);
    
  }

  

  return (
    <div className=' p-5'>
      <div className="flex w-full  items-center space-x-2">
        <Input type="text" 
        placeholder="Search Anything"
        defaultValue={searchParams.get('query')?.toString()} 
        onChange={(e)=>{
          handleSearch(e.target.value)
        }}/>
        <Button type="submit"><SearchIcon /></Button>
      </div>
    </div>
  )
}

export default SearchBar
