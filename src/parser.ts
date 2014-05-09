///<reference path='../third_party/typescript/src/compiler/typeScript.ts' />

module TypeScript {
    var scriptName: string,
        length: number,
        index: number,
        source: string,
        output: string;
    
    export function parse(content: string, fileName: string): string {
        scriptName = fileName;
        source = content;
        length = content.length;
        index = 0;
        output = '';
        scan();
        return output;
    }
    
    function scan(): void {
        var ch: number,
            inSingleLineComment = false,
            inMultiLineComments = false,
            quoteOpen: number = null;
        
        while (index < length) {
            ch = source.charCodeAt(index);
            if (inMultiLineComments) {
                //if we are in a multiline comments just waits for '*/'
                if (ch === CharacterCodes.asterisk) {
                    output += ch;
                    ch = source.charCodeAt(index + 1);
                    if (ch === CharacterCodes.slash) {
                        index++;
                        inMultiLineComments = false;
                    }
                }
            } else if (inSingleLineComment) {
                //if we are in a single line comments just waits for a new line
                if (isLineTerminator(ch)) {
                    inSingleLineComment = false;
                }
            } else if (quoteOpen !== null) {
                //if a single quote or a double quote as been 'open' waits for the same character 
                // except if it has been escaped
                if (ch === quoteOpen && (
                        source.charCodeAt(index -1) !== CharacterCodes.backslash ||
                        source.charCodeAt(index -2) === CharacterCodes.backslash) ) {
                    quoteOpen = null;
                }
            } else if (ch === CharacterCodes.slash) {
                output += ch;
                ch = source.charCodeAt(index + 1);
                if (ch === CharacterCodes.slash) {
                    index++;
                    inSingleLineComment = true;
                } else if (ch === CharacterCodes.asterisk) {
                    index++;
                    inMultiLineComments = true;
                }
            } else if(ch === CharacterCodes.singleQuote || ch === CharacterCodes.doubleQuote) {
                quoteOpen = ch;
            } else if (ch === CharacterCodes.lessThan) {
                ch = source.charCodeAt(index + 1);
                //new typecast syntax <*any>MyVar
                if (ch === CharacterCodes.asterisk) {
                    //skip the asterisk
                    output += '<';
                    index += 2;
                    continue;
                } else {
                    index = tryToParseJSX(index);
                }
            }
            output += String.fromCharCode(ch);
            index++;
        }
    }
    
    function tryToParseJSX(index: number) {
        // first we check if it's followed by an identifier if it's not the case it's not JSX
        
        
        return index;
    }
    
    function isLineTerminator(ch: number): boolean {
        return (
            ch === CharacterCodes.lineFeed ||
            ch === CharacterCodes.carriageReturn ||
            ch === CharacterCodes.lineSeparator ||
            ch === CharacterCodes.paragraphSeparator
        );
    }
    
    
    function isXJSIdentifierStart(ch: number) {
        // exclude backslash (\)
        return (ch !== CharacterCodes.backslash) && isIdentifierStart(ch);
    }
    
    var isIdentifierStartCharacter: boolean[] = ArrayUtilities.createArray<boolean>(CharacterCodes.maxAsciiCharacter, false);
    function isIdentifierStart(interpretedChar: number): boolean {
        if (isIdentifierStartCharacter[interpretedChar]) {
            return true;
        }
        return interpretedChar > CharacterCodes.maxAsciiCharacter && 
            Unicode.isIdentifierStart(interpretedChar, this._languageVersion);
    }
    
    
    function isXJSIdentifierPart(ch: number): boolean {
        // exclude backslash (\) and add hyphen (-)
        return (ch !== 92) && (ch === 45 || isIdentifierPart(ch)); 
    } 
    
    var isIdentifierPartCharacter: boolean[] = ArrayUtilities.createArray<boolean>(CharacterCodes.maxAsciiCharacter, false);
    function isIdentifierPart(interpretedChar: number): boolean {
        if (isIdentifierPartCharacter[interpretedChar]) {
            return true;
        }

        return interpretedChar > CharacterCodes.maxAsciiCharacter && 
            Unicode.isIdentifierPart(interpretedChar, this._languageVersion);
    }
}


declare var module:any;
module.exports = TypeScript;