'use client';
import { useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
export default function Search(props) {
    var _a;
    var searchParams = useSearchParams();
    /*const pathname = usePathname();
    const { replace } = useRouter();*/
    var handleSearch = useDebouncedCallback(function (term) {
        console.log("Searching... ".concat(term));
        props.onTermChange(term);
        /* const params = new URLSearchParams(searchParams);
         if (term) {
             params.set('query', term);
         } else {
             params.delete('query');
         }*/
        //replace(`${pathname}?${params.toString()}`);
    }, 300);
    return (<div className='search'>
      <label htmlFor="search-field" className="sr-only">
        Search
      </label>
      <input className="search-field" placeholder={props.placeholder} onChange={function (e) {
            handleSearch(e.target.value);
        }} defaultValue={(_a = searchParams.get('query')) === null || _a === void 0 ? void 0 : _a.toString()}/>
    </div>);
}
