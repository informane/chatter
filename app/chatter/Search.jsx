'use client';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
export default function Search(props) {
    var _a;
    var searchParams = useSearchParams();
    var pathname = usePathname();
    var replace = useRouter().replace;
    var handleSearch = useDebouncedCallback(function (term) {
        console.log("Searching... ".concat(term));
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
      <input className="search-field" placeholder={props.placeholder} onChange={function (e) {
            handleSearch(e.target.value);
        }} defaultValue={(_a = searchParams.get(props.queryVar)) === null || _a === void 0 ? void 0 : _a.toString()}/>
    </div>);
}
