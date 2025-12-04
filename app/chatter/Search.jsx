'use client';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
export default function Search(props) {
    var _a;
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const handleSearch = useDebouncedCallback((term) => {
        console.log(`Searching... ${term}`);
        props.onTermChange(term);
        /*const params = new URLSearchParams(searchParams);
        if (term) {
            params.set(props.queryVar, term);
        } else {
            params.delete(props.queryVar);
        }
        
          replace(`${pathname}?${params.toString()}`);*/
    }, 300);
    return (<div className='search'>
      <input className="search-field" placeholder={props.placeholder} onChange={(e) => {
            handleSearch(e.target.value);
        }} defaultValue={(_a = searchParams.get(props.queryVar)) === null || _a === void 0 ? void 0 : _a.toString()}/>
    </div>);
}
