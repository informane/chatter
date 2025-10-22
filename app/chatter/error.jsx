'use client'; // Error boundaries must be Client Components
import { useEffect } from 'react';
export default function Error(_a) {
    var error = _a.error, reset = _a.reset;
    useEffect(function () {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);
    return (<div>
      <h2>Something went wrong!</h2>
      <button onClick={
        // Attempt to recover by trying to re-render the segment
        function () { return reset(); }}>
        Try again
      </button>
    </div>);
}
