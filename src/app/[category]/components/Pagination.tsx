import { ProductProps } from "@/app/utils/fetchCategory";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { cn } from "@/lib/utils";
import { ParamValue } from "next/dist/server/request/params";
import {  useRouter, useSearchParams } from "next/navigation";

export function PaginationProducts({listProducts , param, search } : {listProducts: ProductProps | null, param?: ParamValue| undefined , search?: string | null}) {
  const searchParam = useSearchParams();
  const page = parseInt(searchParam.get("page") || "1");
  const route = useRouter();
  const totalPages = listProducts?.totalPages || 1;
  const pagesToShow = [];
  if (page > 1) pagesToShow.push(page - 1);
  pagesToShow.push(page);
  if (page < totalPages) pagesToShow.push(page + 1);
  
  return (
    <Pagination className={cn("cursor-pointer text-[var(--color-text-root)]")}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious className="hover:text-[var(--color-text-root)]" onClick={() => route.push(`/${param ? `${param}?page=${page > 1 ? page - 1 : 1}` : `search?search=${search}&page=${page > 1 ? page - 1 : 1}`}`)} />
        </PaginationItem>

        {pagesToShow.map((p) => (
          <PaginationItem key={p}>
            <PaginationLink
              onClick={() => route.push(`/${param ? `${param}?page=${p}` : `search?search=${search}&page=${p}`}`)}
              isActive={p === page}
              className="hover:text-[var(--color-text-root)]"
            >
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}
        {page < totalPages - 1 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationNext className="hover:text-[var(--color-text-root)]" onClick={() => route.push(`/${param ? `${param}?page=${page < totalPages ? page + 1 : totalPages}` : `search?search=${search}&page=${page < totalPages ? page + 1 : totalPages}`}`)} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
