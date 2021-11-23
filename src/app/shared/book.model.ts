export interface Book{
    id: string,
    volumeInfo: {
        authors: string[],
        title: string
    }
}