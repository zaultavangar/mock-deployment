// mode type
type ModeString = 'brief' | 'verbose';

// object with the key properties of the loaded file
type LoadedFileMap = {
  file_path: string;
  hasHeader: boolean;
}

// object with the key properties of the output for a given command
type OutputMap = {
  command: string;
  hasHeader?: boolean;
  output: string | string[][] | null;
};

// represents a response for a call to load
type LoadResponse = {
    result: string
    data?: string | null
}

// represents a response for a call to view
type ViewResponse = {
    result: string
    data: any[][] | null
}

// represents a resposne for a call to search
type SearchResponse = {
  result: string
  data: any[][] | null
}

