# libraries

While designing the program, I wanted it to be TUI coz they coool
But then, I knew there exists some libraries around that I could use for rendering and make my job easier. Ink and Blessed came up.
Blessed was recommended because of input handling that i need to do for a typing test
But then, chatgpt for once suggested i should just do it manually instead as its a small program and a great learning experience and damn has it been one

So I decided to rawdog it after considerable considerations(lol)

# Streams

Needed a brief revision on node streams and how they work. after a few prompts and documentation reading I found out about the cursor methods in TTY and stdin and stdout stream methods and stuff. Which I really want to look more into one day, for sure but dont konw where i will information on it

# ANSI sequences

While I was looking into streams, i came across this beautiful thing called ANSI sequences, very super duper cool thing btw. Read up on it, understood the structure and everything. super coool overall then setup the core of the game, the typing with colors, backspace and everything

# WPM calculation

turns out there is no on proper standard calculation for WPM. A lot of ways you can do it, the only constant is teh /5 for a word. Its all about how much you want to penalize errors and how you deal with backspace. I chose this formula because it makes the most sense to me, any mistake gets reflected in your accuracy and WPM will go down with strokes wasted in typing the wrong characters anyway and the accuracy is also accoutned by the end by multiplying with WPM. So in my program, the real judge is accuracy + WPM as a whole not just WPM i think

# Refactoring

time for the love hate relationship to fester with refactoring. All of it was in one file now i wanted to have the MVC architecture. Took some time to figure out where things should go and when I did it made everything so much easier and picked up a nefty trick to fetching the state from the game object. IDK, i just like having a game object with a lot of state and methods hahahaha. This was painful but well worth becuase it made implementing a game loop so much easier. I still have trouble with separation of concerns sometimes, hope i am not leaking anything.

# Text Wrapping

OH MY GOD, It was like solving a LeetCode problem damnit. So many bugs, so many implementation errors, unoptimized implementation and just confusion all the way. Finally somehow managed to figure it out and then used a neat trick by storing cursor locations for liver user text wrapping(ik i am smort). but yeah it annoyed my a lot and when it finally worked i was really happy.

# Rendering

Flickering, insane flickering. Because clearing and writing individually each character takes too much time and causes heavy flickering.
Figured out you need to keep a frame/buffer and then write to it and then write the entire frame to the terminal. It reduced flickering by a lot, but theres more i can do i think. Differential rendering to the rescue, i will do grid based for the least flickering. OMG literally zero flickering after grid differential rendering. THIS IS SO GOOD
I didnt know i could reduce flickering to zero!

# Testing Text

I wanted proper sentences like nitrotype has with a little punctuation and stuff. I tried getting text from alice in the wonderland and making that work but normalizing the text with all the white spaces and all just didnt sit right or maybe i just realized it was very doable and i just had to place a trim() in the right place and would have solved that issue. But that I did with of Chatgpt anyways so it didnt feel right either way. It once again reinforced the idea that I hate data processing stuff. So i just settled with text generation like monkey type does.

## Side notes

I feel a growing need to add a text rendering function I swear to god, i am tired of refactoring 4 functions each time i add an improvement to the rendering. OMG i am stupid as hell, fixing the cursor was so easy if i had just used cursorlocations lol, why did i not think of that until now. I am dumbo dumbo
