import { useCallback, useState } from 'react'
import './App.css'
import { Movies } from './components/Movies.jsx'
import { useMovies } from './hooks/useMovies.js'
import { useSearch } from './hooks/useSearch.js'
import debounce from 'just-debounce-it'


function App() {
  const [sort, setSort] = useState(false)
  const {search, updateSearch, error} = useSearch()
  const {movies, loading, getMovies} = useMovies({search , sort})

  const debouncedGetMovies = useCallback(
    debounce(search => {
      console.log('search', search)
      getMovies({ search })
    }, 300 )
    ,[getMovies]
  )

  const handleSubmit = (event) => {
    event.preventDefault()

    // [Formas no controladas]
    //
    // Use ref:
    //const value = inputRef.current.value
    //
    // window.FormData:
    //const fields = new window.FormData(event.target)
    //const search = fields.get('search')
    //
    // Object.fromEntries:
    //const {search} = Object.fromEntries(new window.FormData(event.target))

    getMovies({search})
  }

  const handleSort = () => {
    setSort(!sort)
  }

  const handleChange = (event) =>{
    const newSearch = event.target.value
    if (newSearch.startsWith(' ')) return
    updateSearch(newSearch)
    debouncedGetMovies(newSearch)
  
  }

  return (
    <div className='page'>
      <header>
        <h1>Buscador de películas</h1>
        <form className="form" onSubmit={handleSubmit}>
          <input style={{border: '1px solid transparent', borderColor: error ? 'red': 'transparent'}} onChange={handleChange} value={search} type="text" name="search" placeholder='The Avengers, Star Wars, The Matrix...' />
          <input type="checkbox" onChange={handleSort} checked={sort} />
          <button type='submit'>Buscar</button>
        </form>
        {error && <p style={{color:'red'}}>{error}</p>}
      </header>
      <main>
        {
        loading ? <p>Cargando..</p> : <Movies movies={movies} />
        }
      </main>
    </div>
  )
}

export default App
