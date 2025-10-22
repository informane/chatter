'use client';
 
import { propagateServerField } from 'next/dist/server/lib/render-server';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export default function Search(props: {onTermChange: Function, placeholder: string, model: string}) {
  const searchParams = useSearchParams();
  /*const pathname = usePathname();
  const { replace } = useRouter();*/
 

    const handleSearch = useDebouncedCallback((term) => {
    console.log(`Searching... ${term}`);
    props.onTermChange(term);  
   /* const params = new URLSearchParams(searchParams);
    if (term) {
        params.set('query', term);
    } else {
        params.delete('query');
    }*/
    
      //replace(`${pathname}?${params.toString()}`);
    }, 300);

    return (
    <div className='search'>
      <label htmlFor="search-field" className="sr-only">
        Search
      </label>
      <input
        className="search-field"
        placeholder={props.placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get('query')?.toString()}
      />
    </div>
  );
}