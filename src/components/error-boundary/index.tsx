import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PropsWithChildren } from "react";
import { FallbackProps, ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";

export interface ErrorBoundaryProps {

}

function Fallback({ error, }: FallbackProps) {
    // Call resetErrorBoundary() to reset the error boundary and retry the render.

    return (
        <div className={`
        w-full h-full p-3 bg-red-800/[.2] 
        flex flex-col items-center grow
        rounded-std-sm border-solid border-red-800
        `} role="alert">
            <p className={`
            h-[40px] my-3
            flex items-center gap-2 
            text-3xl font-bold text-red-500 font-bold 
            `}>
                <FontAwesomeIcon icon={faTriangleExclamation} />
                Something went wrong
            </p>
            <pre className={`
            w-[95%] p-5 grow bg-black/[.5]
            rounded-std-sm border-solid border-neutral-700
            font-bold text-light 
            `}>
                {error.message}
            </pre>
        </div>
    );
}

export default function ErrorBoundary({ children }: PropsWithChildren<ErrorBoundaryProps>) {
    return <ReactErrorBoundary
        FallbackComponent={Fallback}>
        {children}
    </ReactErrorBoundary>
}