// AI-assisted: see AI-ATTRIBUTION.md

// One page of results from a paged query, plus whether more pages exist.
export class DataPage<T> {
  constructor(
    public readonly items: T[],
    public readonly hasMore: boolean,
  ) {}
}
